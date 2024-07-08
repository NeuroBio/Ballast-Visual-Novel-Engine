import { SavedDataDto } from './SaveDataRepo';

interface SavedDataParams {
	currentChapterKey: string;
	currentSceneKey: string;
	achievementKeys: string[];
	completeChapterKeys: string[];
}

export class SavedData {
	#currentChapterKey: string;
	#currentSceneKey: string;
	#achievementKeys: string[];
	#completeChapterKeys: string[];

	constructor (params: SavedDataParams) {
		const { currentChapterKey, currentSceneKey, achievementKeys, completeChapterKeys } = params;
		this.#currentChapterKey = currentChapterKey;
		this.#currentSceneKey = currentSceneKey;
		this.#achievementKeys = achievementKeys;
		this.#completeChapterKeys = completeChapterKeys;
	}

	// startNewChapter () {

	// }

	// advanceToNextScene () {

	// }

	// getCurrentState () {

	// }

	// getAchievements () {

	// }

	// getCompletedChapters () {

	// }

	toDto (): SavedDataDto {
		return {
			currentChapterKey: this.#currentChapterKey,
			currentSceneKey: this.#currentSceneKey,
			achievementKeys: [...this.#achievementKeys],
			completeChapterKeys: [...this.#completeChapterKeys],
		};
	}
}