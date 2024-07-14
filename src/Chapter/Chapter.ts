import { SavedChapterData } from '../SavedData/SavedData';
import { ChapterDto } from './ChapterFinder';

export class Chapter {
	#key: string;
	#name: string;
	#sceneKeys: Set<string>;
	#locked: boolean;
	#firstSceneKey: string;
	#currentSceneKey: string;
	#allowReplay: boolean;

	constructor (params: ChapterDto) {
		const { key, name, sceneKeys, locked, firstSceneKey, allowReplay } = params;
		this.#key = key;
		this.#name = name;
		this.#sceneKeys = new Set(sceneKeys);
		this.#locked = locked ?? true;
		this.#firstSceneKey = firstSceneKey;
		this.#currentSceneKey = firstSceneKey;
		this.#allowReplay = allowReplay ?? false;
	}

	get key (): string {
		return this.#key;
	}

	get isLocked (): boolean {
		return this.#locked;
	}

	restart (): string {
		return this.#firstSceneKey;
	}

	start (): string {
		return this.#currentSceneKey;
	}

	reload (save: SavedChapterData): void {
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
}