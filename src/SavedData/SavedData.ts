import { SavedDataDto } from './SaveDataRepo';

interface SavedDataParams {
	priorChapterKey: string;
	priorSceneKey: string;
	currentChapterKey: string;
	currentSceneKey: string;
	achievementKeys: string[];
	completeChapterKeys: string[];
}

export class SavedData {
	#priorChapterKey: string;
	#priorSceneKey: string;
	#currentChapterKey: string;
	#currentSceneKey: string;
	#achievementKeys: string[];
	#completeChapterKeys: string[];

	constructor (params: SavedDataParams) {
		const { priorChapterKey, priorSceneKey, currentChapterKey, currentSceneKey,
			achievementKeys, completeChapterKeys } = params;
		this.#priorChapterKey = priorChapterKey;
		this.#priorSceneKey = priorSceneKey;
		this.#currentChapterKey = currentChapterKey;
		this.#currentSceneKey = currentSceneKey;
		this.#achievementKeys = achievementKeys;
		this.#completeChapterKeys = completeChapterKeys;
	}

	get achievementKeys () {
		return [...this.#achievementKeys];
	}

	get completedChaptersKeys () {
		return [...this.#completeChapterKeys];
	}

	get currentChapterKey () {
		return this.#currentChapterKey;
	}

	get currentSceneKey () {
		return this.#currentSceneKey;
	}

	startNewChapter (newChapterKey: string) {
		this.#currentChapterKey = newChapterKey;
	}

	completeChapter () {
		this.#priorChapterKey = this.#currentChapterKey;
		this.#currentChapterKey = '';
		this.#priorSceneKey = this.currentSceneKey;
		this.#currentSceneKey = '';
	}


	// startNewScene () {

	// }

	// completeScene () {
	// super back and forth on whether I need this
	// if I do, I need to modify complete chapter to only do scene logic when current scene is set
	// }

	// unlockAchievement () {

	// }


	toDto (): SavedDataDto {
		return {
			priorChapterKey: this.#priorChapterKey,
			priorSceneKey: this.#priorSceneKey,
			currentChapterKey: this.#currentChapterKey,
			currentSceneKey: this.#currentSceneKey,
			achievementKeys: [...this.#achievementKeys],
			completeChapterKeys: [...this.#completeChapterKeys],
		};
	}
}