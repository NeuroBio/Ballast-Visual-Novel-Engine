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

window.advanceScene = (nextBeat) => {
	console.log('advancing');
	resetDisplayData();

	try {
		if (beat?.choices && !nextBeat) {
			throw new Error('You have to use the choice selection buttons to advance a Choice Beat!');
		}
		const newBeat = engine.advanceScene({ beatKey: nextBeat || beat?.nextBeat || '' });
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
		priorScene = undefined;
		save = undefined;
		priorSave = undefined;
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

	const outputElement = d3.select('#beat-output');
	if (!beat) {
		outputElement.html('...');
	} else if (beat?.choices) {
		outputElement.html('');
		beat.choices.forEach((x) => {
			const button = outputElement.append('button')
				.text(x.text)
				.attr('type', 'button')
				.attr('onClick', `advanceScene("${x.nextBeat}")`);
			if (!x.mayPlay) {
				button.attr('disabled', 'true');
			}
		});
	} else {
		outputElement.html(`<b>${beat.speaker}:</b> ${beat.text}`);
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
		: d3.select('#error').text('...').attr('class', '');
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
	};
	const saveData = beat.saveData;
	if (!saveData) {
		return;
	}

	if (saveData.unlockedChapters) {
		saveData.unlockedChapters.forEach((x) =>
			save.unlockedChapters.push(x));
	}

	if (saveData.unlockedAchievements) {
		saveData.unlockedAchievements.forEach((x) =>
			save.unlockedAchievements.push(x));
	}

	if (saveData.addedItems) {
		saveData.addedItems.forEach((x) => {
			console.log(x);
			save.inventory[x.item] ??= 0;
			save.inventory[x.item] += x.quantity;
		});
	}

	if (saveData.removedItems) {
		saveData.removedItems.forEach((x) => {
			save.inventory[x.item] ??= 0;
			save.inventory[x.item] -= x.quantity;
		});
	}
}

function writeChangeJson ({ value, key = '', oldValue, addSpaces, depth = 0, shouldKey = false, element }) {
	const keyPrefix = shouldKey ? `"${key}": ` : ``;
	const tab = depth ? new Array(addSpaces * depth).fill(' ').join('') : '';
	const isArray = Array.isArray(value);

	if (typeof value === 'boolean') {
		const code = element.append('code')
			.text(`${tab}${keyPrefix}${value},\n`);
		highlightChanges (value, oldValue, code);
		return;
	}

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
		const codeEntry = element.append('code').text(`${tab}${keyPrefix}[\n`);
		Object.entries(value).forEach(([nextKey, nextValue]) => {
			const nextIsArray = Array.isArray(nextValue);
			const defaultOldValue = nextIsArray ? [] : {};
			const nextOldValue = oldValue ? oldValue?.[nextKey] ?? defaultOldValue : undefined;
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
		const codeExit = element.append('code').text(`${tab}],\n`);

		if (!!key && (!oldValue || oldValue.length === 0)) {
			codeEntry.attr('class', 'updated');
			codeExit.attr('class', 'updated');
		}
	} else {
		const codeEntry = element.append('code').text(`${tab}${keyPrefix}{\n`);
		Object.entries(value).forEach(([nextKey, nextValue]) => {
			const nextIsArray = Array.isArray(nextValue);
			const defaultOldValue = nextIsArray ? [] : {};
			const nextOldValue = oldValue ? oldValue?.[nextKey] ?? defaultOldValue : undefined;
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

			if (!!key && (oldKeys.length === 0 || newKeys.length !== oldKeys.length)) {
				codeEntry.attr('class', 'updated');
				codeExit.attr('class', 'updated');
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
