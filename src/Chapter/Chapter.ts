import { SavedChapterData } from '../SavedData/SavedData';

interface ChapterParams {
	sceneKeys: string[];
	locked: boolean;
	firstSceneKey: string;
	name: string;
	key: string;
}

export class Chapter {
	#key: string;
	#name: string;
	#sceneKeys: string[];
	#locked: boolean;
	#firstSceneKey: string;
	#currentSceneKey: string;

	constructor (params: ChapterParams) {
		const { key, name, sceneKeys, locked, firstSceneKey } = params;
		this.#key = key;
		this.#name = name;
		this.#sceneKeys = sceneKeys;
		this.#locked = locked;
		this.#firstSceneKey = firstSceneKey;
		this.#currentSceneKey = firstSceneKey;
	}

	restart () {
		return this.#firstSceneKey;
	}

	start () {
		return this.#currentSceneKey;
	}

	isLocked () {
		return this.#locked;
	}

	reload (save: SavedChapterData) {
		// const shouldUnlock = (save.currentChapterKey === this.#key
		// 	|| save.completedChaptersKeys.includes(this.#key));
		// unlock
		// change current scene
	}

	// advanceToNextScene () {

	// }
}