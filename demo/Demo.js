import { Engine } from './CompiledEngine/Engine/Engine.js';
import { DemoData } from './DemoData.js';

const engine = new Engine({
	findChapterData: async () => {
		actions.push('• Find Chapter');
		return DemoData.Chapters;
	},
	findSceneData: async () => {
		actions.push('• Find Scene');
		return DemoData.Scenes;
	},
	findCharacterData: async () => {
		actions.push('• Find Character Template Data');
		return DemoData.CharacterTemplates;
	},
	findSavedData: async () => {
		actions.push('• Find Save Data');
		return;
	},
	createSavedData: async () => {
		actions.push('• Create Save Data');
		return {
			activeChapters: {},
			unlockedChapters: [],
			completedChapters: [],
			inventory: {},
			achievements: [],
			characters: [],
		};
	},
	saveSavedData: async () => {
		actions.push('• Manually Save Data');
	},
	autosaveSaveData: async () => {
		actions.push('• Auto-Save Save Data');
	},
});

let beat;
let priorBeat;
let scene;
let priorScene;
let save;
let priorSave;
let actions = [];
let errorMessage;


window.startChapter = async () => {
	console.log('starting');
	resetDisplayData();

	try {
		beat = await engine.startChapter({ chapterKey: DemoData.Chapters[0].key });
		applySceneData(beat);
		applySaveData(beat);
	} catch (error) {
		console.error(error.message);
		errorMessage = error.message;
	}

	updateDisplay();
};

window.advanceScene = () => {
	console.log('advancing');
	resetDisplayData();

	try {
		const newBeat = engine.advanceScene({ beatKey: beat?.nextBeat || '' });
		priorBeat = beat;
		beat = newBeat;
		applySceneData(beat);
		applySaveData(beat);
	} catch (error) {
		console.error(error.message);
		errorMessage = error.message;
	}

	updateDisplay();
};

window.completeScene = async () => {
	console.log('completing');
	resetDisplayData();

	try {
		await engine.completeScene();
		scene = undefined;
		beat = undefined;
		priorBeat = undefined;
	} catch (error) {
		console.error(error.message);
		errorMessage = error.message;
	}

	updateDisplay();
};

window.restartScene = async () => {
	console.log('restarting');
	resetDisplayData();

	try {
		beat = await engine.restartScene();
		priorBeat = undefined;
		scene = undefined;
		applySceneData(beat);
		applySaveData(beat);
	} catch (error) {
		console.error(error.message);
		errorMessage = error.message;
	}

	updateDisplay();
};

window.save = async () => {
	console.log('saving');
	resetDisplayData();

	try {
		await engine.save();
	} catch (error) {
		console.error(error.message);
		errorMessage = error.message;
	}

	updateDisplay();
};

function resetDisplayData () {
	errorMessage = '';
	actions = [];
}

function updateDisplay () {
	const beatElement = d3.select('#beat');
	if (!beat) {
		beatElement.html('...');
	} else {
		beatElement.html('');
		writeChangeJson ({ value: beat, oldValue: priorBeat, addSpaces: 4, element: beatElement });
	}


	const sceneElement = d3.select('#scene');
	if (!scene) {
		sceneElement.html('...');
	} else {
		sceneElement.html('');
		writeChangeJson ({ value: scene, oldValue: priorScene, addSpaces: 4, element: sceneElement });
	}

	const saveElement = d3.select('#save');
	if (!save) {
		saveElement.html('...');
	} else {
		saveElement.html('');
		writeChangeJson ({ value: save, oldValue: priorSave, addSpaces: 4, element: saveElement });
	}

	d3.select('#actions').html(actions.join('<br>') || '...');

	errorMessage
		? d3.select('#error').text(errorMessage).attr('class', 'error')
		: d3.select('#error').text('...');
}

function applySceneData (beat) {
	priorScene = scene ? {
		characters: { ...scene.characters },
		background: scene.background,
	} : undefined;
	scene ??= {
		background: '',
		characters: {},
	};
	const sceneData = beat.sceneData || beat.default?.sceneData;
	if (!sceneData) {
		return;
	}


	const {
		setBackground,
		updateCharacterSprites,
		moveCharacters,
		removeCharacters,
		addCharacters,
	} = sceneData;

	if (setBackground) {
		scene.background = setBackground;
	}

	if (updateCharacterSprites) {
		updateCharacterSprites.forEach(x =>
			scene.characters[x.character].position = x.sprite);
	}

	if (moveCharacters) {
		moveCharacters.forEach(x =>
			scene.characters[x.character].position = x.position);
	}

	if (removeCharacters) {
		removeCharacters.forEach(x => delete scene.characters[x.character]);
	}

	if (addCharacters) {
		addCharacters.forEach(x =>
			scene.characters[x.character] = { position: x.position, sprite: x.sprite });
	}
}

function applySaveData () {
	priorSave = save ? {
		unlockedChapters: [...save.unlockedChapters],
		unlockedAchievements: [...save.unlockedAchievements],
		inventory: { ...save.inventory },
		characterUpdates: { ...save.characterUpdates },
	} : undefined;
	save ??= {
		unlockedChapters: [],
		unlockedAchievements: [],
		inventory: {},
		characterUpdates: { },
	};
	const saveData = beat.saveData;
	if (!saveData) {
		return;
	}
}

function writeChangeJson ({ value, key = '', oldValue, addSpaces, depth = 0, shouldKey = false, element }) {
	const keyPrefix = shouldKey ? `"${key}": ` : ``;
	const tab = depth ? new Array(addSpaces * depth).fill(' ').join('') : '';
	const isArray = Array.isArray(value);

	if (typeof value === 'string') {
		const code = element.append('code')
			.text(`${tab}${keyPrefix}"${value}",\n`);
		highlightChanges (value, oldValue, code);
		return;
	}

	if (typeof value === 'number') {
		const code = element.append('code')
			.text(`${tab}${keyPrefix}${value},\n`);
		highlightChanges (value, oldValue, code);
		return;
	}

	if (isArray && value.length === 0) {
		const code = element.append('code')
			.text(`${tab}${keyPrefix}[],\n`);
		if (oldValue && oldValue.length !== 0) {
			code.attr('class', 'updated');
		}
		return;
	}

	if (!isArray && Object.keys(value).length === 0) {
		const code = element.append('code')
			.text(`${tab}${keyPrefix}{},\n`);
		if (oldValue && Object.keys(oldValue).length !== 0) {
			code.attr('class', 'updated');
		}
		return;
	}


	if (isArray) {
		element.append('code').text(`${tab}${keyPrefix}[\n`);
		Object.entries(value).forEach(([nextKey, nextValue]) => {
			const nextOldValue = oldValue ? oldValue?.[nextKey] ?? [] : undefined;
			writeChangeJson({
				value: nextValue,
				key: nextKey,
				oldValue: nextOldValue,
				addSpaces,
				depth: depth + 1,
				shouldKey: false,
				element,
			});
		});
		element.append('code').text(`${tab}],\n`);
	} else {
		const codeEntry = element.append('code').text(`${tab}${keyPrefix}{\n`);
		Object.entries(value).forEach(([nextKey, nextValue]) => {
			const nextOldValue = oldValue ? oldValue?.[nextKey] ?? {} : undefined;
			writeChangeJson({
				value: nextValue,
				key: nextKey,
				oldValue: nextOldValue,
				addSpaces,
				depth: depth + 1,
				shouldKey: true,
				element,
			});
		});
		const codeExit = element.append('code').text(`${tab}},\n`);

		if (oldValue) {
			const newKeys = Object.keys(value);
			const oldKeys = Object.keys(oldValue);

			if (newKeys.length !== oldKeys.length) {
				codeEntry.attr('class', 'updated');
				codeExit.attr('class', 'updated');
				return;
			}

			for (const oldKey of oldKeys) {
				if (!newKeys.includes(oldKey)) {
					codeEntry.attr('class', 'updated');
					codeExit.attr('class', 'updated');
					return;
				}
			}
		}
	}
}

function highlightChanges (newData, oldData, element) {
	if (oldData !== undefined && oldData != newData) {
		element.attr('class', 'updated');
	}
}

updateDisplay();
