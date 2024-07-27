console.log('loading...');

import { Engine } from './CompiledEngine/Engine/Engine.js';
import { DemoData } from './DemoData.js';

const engine = new Engine({
	findChapterData: async () => {
		actions.push('Find Chapter');
		return DemoData.Chapters;
	},
	findSceneData: async () => {
		actions.push('Find Scene');
		return DemoData.Scenes;
	},
	findCharacterData: async () => {
		actions.push('Find Character Template Data');
		return DemoData.CharacterTemplates;
	},
	findSavedData: () => async () => {
		actions.push('Find Save Data');
		return;
	},
	createSavedData: () => async () => {
		actions.push('Create Save Data');
		return {
			activeChapters: {},
			unlockedChapters: [],
			completedChapters: [],
			inventory: {},
			achievements: [],
			characters: [],
		};
	},
	saveSavedData: () => async () => {
		actions.push('Manually Save Data');
	},
	autosaveSaveData: () => async () => {
		actions.push('Auto-Save Save Data');
	},
});

let beat = '...';
const scene = '...';
const actions = [];
let errorMessage = '';


window.startChapter = async () => {
	console.log('starting');
	try {
		beat = await engine.startChapter({ chapterKey: 'demo' });
	} catch (error) {
		console.error(error.message);
		errorMessage = error.message;
	}
};

window.advanceScene = () => {
	console.log('advancing');
	errorMessage = '';
	try {
		engine.advanceScene({ beatKey: beat.nextBeat });
	} catch (error) {
		console.error(error.message);
		errorMessage = error.message;
	}
};

window.completeScene = async () => {
	console.log('completing');
	errorMessage = '';
	try {
		await engine.completeScene();
	} catch (error) {
		console.error(error.message);
		errorMessage = error.message;
	}
};

window.restartScene = async () => {
	console.log('restarting');
	errorMessage = '';
	try {
		await engine.restartScene();
	} catch (error) {
		console.error(error.message);
		errorMessage = error.message;
	}
};

window.save = () => {
	console.log('saving');
	errorMessage = '';
	try {
		engine.save();
	} catch (error) {
		console.error(error.message);
		errorMessage = error.message;
	}
};

function updateDisplay () {

}