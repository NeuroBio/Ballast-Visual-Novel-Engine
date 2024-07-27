import { ChapterDto } from '../Chapter/ChapterFinder';
import { CharacterTemplate } from '../Character/CharacterTemplateFinder';
import { SavedDataDto } from '../SavedData/SaveDataRepo';
import { SceneDto } from '../Scene/SceneFinder';
import { Engine } from './Engine';

interface EngineParams {
	findChapterData: (key?: string) => Promise<ChapterDto[]>;
	findSceneData: (key?: string) => Promise<SceneDto[]>;
	findCharacterData: () => Promise<CharacterTemplate[]>;
	findSavedData: () => Promise<SavedDataDto | void>;
	createSavedData?: () => Promise<SavedDataDto>;
	saveSavedData: (saveData: SavedDataDto) => Promise<void>;
	autosaveSaveData?: (saveData: SavedDataDto) => Promise<void>;
}

export class VNEngine {
	static #activeEngine: Engine;
	static create (params: EngineParams) {
		this.#activeEngine = new Engine(params);
		return this.#activeEngine;
	}

	static getLastEngine () {
		return this.#activeEngine;
	}
}
