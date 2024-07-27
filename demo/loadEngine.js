console.log('loading...');

import { Engine } from './CompiledEngine/Engine/Engine.js';

const engine = new Engine({
	findChapterData: () => Promise.resolve([]),
	findSceneData: () => Promise.resolve([]),
	findCharacterData: () => Promise.resolve([]),
	findSavedData: () => Promise.resolve(),
	createSavedData: () => Promise.resolve(),
	saveSavedData: () => Promise.resolve([]),
	autosaveSaveData: () => Promise.resolve([]),
});
