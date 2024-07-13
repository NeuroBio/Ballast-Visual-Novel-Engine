import { Character, CharacterDto } from '../Character/Character';
import { SavedDataDto } from './SaveDataRepo';

interface SavedDataParams {
	activeChapters: { [chapterKey: string]: string };
	unlockedChapters: string[];
	completedChapters: string[];
	inventory: { [itemKey: string]: number };
	achievements: string[];
	characters: CharacterDto[]
}

interface InventoryItemParams {
	key: string;
	quantity: number;
}

export interface SavedChapterData {
	isUnlocked: boolean,
	wasCompleted: boolean,
	queuedScene: string,
}

export class SavedData {
	#activeChapters: { [key: string]: string };
	#unlockedChapters: string[];
	#completedChapters: string[];
	#inventory: { [itemKey: string]: number };
	#achievements: string[];
	#characters: { [characterKey: string]: Character };

	constructor (params: SavedDataParams) {
		const { activeChapters, unlockedChapters, completedChapters,
			characters, inventory, achievements } = params;
		this.#activeChapters = activeChapters;
		this.#unlockedChapters = unlockedChapters;
		this.#completedChapters = completedChapters;
		this.#inventory = inventory;
		this.#achievements = achievements;
		this.#characters = characters.reduce((keyed: {[key: string]: Character}, dto) => {
			keyed[dto.key] = new Character(dto);
			return keyed;
		}, {});
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

	getChapterData (chapterKey: string): SavedChapterData {
		return {
			isUnlocked: !!(this.#unlockedChapters.find((x) => x === chapterKey)),
			wasCompleted: !!(this.#completedChapters.find((x) => x === chapterKey)),
			queuedScene: this.#activeChapters[chapterKey] || '',
		};
	}

	queueScene (chapterKey: string, sceneKey: string): void {
		this.#activeChapters[chapterKey] = sceneKey;
	}

	unlockChapter (unlockedChapter: string): void {
		this.#unlockedChapters.push(unlockedChapter);
	}

	unlockAchievement (newAchievement: string): void {
		this.#achievements.push(newAchievement);
	}

	// updateCharacterSentiment (): void {

	// }

	// addMemoryToCharacter (): void {

	// }

	// removeMemoryFromCharacter (): void {

	// }

	addInventoryItem (params: InventoryItemParams): void {
		const { key, quantity } = params;
		this.#inventory[key] = this.#inventory[key] ?? 0;
		this.#inventory[key] += quantity;
	}

	removeInventoryItem (params: InventoryItemParams): void {
		const { key, quantity } = params;
		this.#inventory[key] = this.#inventory[key] ?? 0;
		this.#inventory[key] -= quantity;
		if (this.#inventory[key] <= 0) {
			delete this.#inventory[key];
		}
	}

	getQueuedSceneForChapter (chapterKey: string) {
		return this.#activeChapters[chapterKey];
	}

	completeChapter (chapterKey: string): void {
		this.#completedChapters.push(chapterKey);
		delete this.#activeChapters[chapterKey];
	}

	toDto (): SavedDataDto {
		return {
			activeChapters: { ...this.#activeChapters },
			unlockedChapters: [...this.#unlockedChapters],
			completedChapters: [...this.#completedChapters],
			inventory: { ...this.#inventory },
			achievements: [...this.#achievements],
			characters: Object.values(this.#characters).map((char) => char.toDto()),
		};
	}

	clone (): SavedData {
		return new SavedData(this.toDto());
	}
}