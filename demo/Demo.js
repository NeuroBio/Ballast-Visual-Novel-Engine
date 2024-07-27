console.log('loading...');

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
		beat = engine.advanceScene({ beatKey: beat?.nextBeat || '' });
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
		await engine.restartScene();
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
	d3.select('#beat').text(JSON.stringify(beat, null, 2) || '...');
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

updateDisplay();
