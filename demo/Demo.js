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
let actions = [];
let errorMessage;


window.startChapter = async () => {
	console.log('starting');
	resetDisplayData();

	try {
		beat = await engine.startChapter({ chapterKey: DemoData.Chapters[0].key });
		applySceneData(beat);
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
	d3.select('#error').text(errorMessage || '...');
	d3.select('#actions').html(actions.join('<br>') || '...');
	if (!beat) {
		d3.select('#beat').html('...');
	} else {
		d3.select('#beat').html('');
		writeChangeJson ({ value: beat, oldValue: priorBeat, addSpaces: 4 });
	}
	d3.select('#scene').text(JSON.stringify(scene, null, 2) || '...');
}

function applySceneData (beat) {
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

function writeChangeJson ({ value, key = '', oldValue, addSpaces, depth = 0, shouldKey = false }) {
	const keyPrefix = shouldKey ? `"${key}": ` : ``;
	const tab = depth ? new Array(addSpaces * depth).fill(' ').join('') : '';
	const isArray = Array.isArray(value);

	if (typeof value === 'string') {
		const code = d3.select('#beat').append('code')
			.text(`${tab}${keyPrefix}"${value}",\n`);
		highlightChanges (value, oldValue, code);
		return;
	}

	if (typeof value === 'number') {
		const code = d3.select('#beat').append('code')
			.text(`${tab}${keyPrefix}${value},\n`);
		highlightChanges (value, oldValue, code);
		return;
	}

	if (isArray && value.length === 0) {
		const code = d3.select('#beat').append('code')
			.text(`${tab}${keyPrefix}[],\n`);
		if (oldValue && oldValue.length !== 0) {
			code.attr('class', 'updated');
		}
		return;
	}

	if (!isArray && Object.keys(value).length === 0) {
		const code = d3.select('#beat').append('code')
			.text(`${tab}${keyPrefix}{},\n`);
		if (Object.keys(oldValue && oldValue).length !== 0) {
			code.attr('class', 'updated');
		}
		return;
	}


	if (isArray) {
		d3.select('#beat').append('code').text(`${tab}${keyPrefix}[\n`);
		Object.entries(value).forEach(([nextKey, nextValue]) => {
			const nextOldValue = oldValue ? oldValue?.[nextKey] || [] : undefined;
			writeChangeJson({
				value: nextValue,
				key: nextKey,
				oldValue: nextOldValue,
				addSpaces,
				depth: depth + 1,
				shouldKey: false,
			});
		});
		d3.select('#beat').append('code').text(`${tab}],\n`);
	} else {
		d3.select('#beat').append('code').text(`${tab}${keyPrefix}{\n`);
		Object.entries(value).forEach(([nextKey, nextValue]) => {
			const nextOldValue = oldValue ? oldValue?.[nextKey] || {} : undefined;
			writeChangeJson({
				value: nextValue,
				key: nextKey,
				oldValue: nextOldValue,
				addSpaces,
				depth: depth + 1,
				shouldKey: true,
			});
		});
		d3.select('#beat').append('code').text(`${tab}},\n`);
	}
}

function highlightChanges (newData, oldData, element) {
	if (oldData !== undefined && oldData != newData) {
		element.attr('class', 'updated');
	}
}

updateDisplay();
