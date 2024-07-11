import { SavedDataDto } from './SaveDataRepo';

interface SavedDataParams {
	activeChapters: { [chapterKey: string]: string };
	unlockedChapters: string[];
	completedChapters: string[];
	inventory: { [itemKey: string]: number };
	achievements: string[];
	// characters: { [characterKey: string]: Character }
}

export class SavedData {
	#activeChapters: { [key: string]: string };
	#unlockedChapters: string[];
	#completedChapters: string[];
	#inventory: { [itemKey: string]: number };
	#achievements: string[];
	// #characters: { [characterKey: string]: Character };

	constructor (params: SavedDataParams) {
		const { activeChapters, unlockedChapters, completedChapters,
			inventory, achievements } = params;
		this.#activeChapters = activeChapters;
		this.#unlockedChapters = unlockedChapters;
		this.#completedChapters = completedChapters;
		this.#inventory = inventory;
		this.#achievements = achievements;
		// this.#characters - characters;
	}

	get achievementKeys () {
		return [...this.#achievements];
	}

	get completedChaptersKeys () {
		return [...this.#completedChapters];
	}

	startNewChapter (chapterKey: string, sceneKey: string): void {
		this.#activeChapters[chapterKey] = sceneKey;
	}

	getChapterData (chapterKey: string) {
		this.#unlockedChapters.find((x) => x === chapterKey);
		this.#completedChapters.find((x) => x === chapterKey);
		this.#activeChapters[chapterKey];
		// returns an object of
		// isUnlocked
		// wasCompleted
		// queuedScene
	}

	queueScene (chapterKey: string, sceneKey: string): void {
		this.#activeChapters[chapterKey] = sceneKey;
	}

	completeChapter (chapterKey: string): void {
		this.#completedChapters.push(chapterKey);
		delete this.#activeChapters[chapterKey];
	}


	// completeScene () {
	// super back and forth on whether I need this
	// if I do, I need to modify complete chapter to only do scene logic when current scene is set
	// }

	// unlockAchievement () {

	// }


	toDto (): SavedDataDto {
		return {
			activeChapters: { ...this.#activeChapters },
			unlockedChapters: [...this.#unlockedChapters],
			completedChapters: [...this.#completedChapters],
			inventory: { ...this.#inventory },
			achievements: [...this.#achievements],
		};
	}
}