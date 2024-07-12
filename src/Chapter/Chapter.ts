import { SavedChapterData } from '../SavedData/SavedData';

interface ChapterParams {
	sceneKeys: string[];
	locked?: boolean;
	firstSceneKey: string;
	name: string;
	key: string;
	allowReplay?: boolean;
}

export class Chapter {
	#key: string;
	#name: string;
	#sceneKeys: Set<string>;
	#locked: boolean;
	#firstSceneKey: string;
	#currentSceneKey: string;
	#allowReplay: boolean;

	constructor (params: ChapterParams) {
		const { key, name, sceneKeys, locked, firstSceneKey, allowReplay } = params;
		this.#key = key;
		this.#name = name;
		this.#sceneKeys = new Set(sceneKeys);
		this.#locked = locked ?? true;
		this.#firstSceneKey = firstSceneKey;
		this.#currentSceneKey = firstSceneKey;
		this.#allowReplay = allowReplay ?? false;
	}

	get key () {
		return this.#key;
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
		if (save.isUnlocked) {
			this.#locked = false;
		}

		if (this.#locked) {
			throw new Error('This chapter has not yet been unlocked.');
		}

		if (save.queuedScene) {
			if (!this.#sceneKeys.has(save.queuedScene)) {
				throw new Error('Tried to restart chapter at an invalid scene.');
			}

			this.#currentSceneKey = save.queuedScene;
		}

		if (save.wasCompleted && this.#allowReplay === false) {
			throw new Error('This chapter has already been completed and does not allow replays');
		}
	}

	// advanceToNextScene () {

	// }
}