import { Character } from '../Character/Character';
import { CharacterTemplate } from '../Character/CharacterTemplateFinder';
import { SavedDataDto } from './SaveDataRepo';

export interface SceneParams {
	chapterKey: string,
	sceneKey: string,
}
export interface InventoryItem {
	item: string;
	quantity: number;
}

export interface MemoryParams {
	character: string;
	memory: string;
}

export interface TraitParams {
	character: string;
	trait: string;
	change: number;
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

	constructor (params: SavedDataDto) {
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

	get characters (): { [characterKey: string]: Character } {
		return Object.keys(this.#characters).reduce((keyed: { [characterKey: string]: Character }, key) => {
			keyed[key] = this.#characters[key].clone();
			return keyed;
		}, {});
	}

	get achievementKeys (): string[] {
		return [...this.#achievements];
	}

	get completedChaptersKeys (): string[] {
		return [...this.#completedChapters];
	}

	get inventory (): { [itemKey: string]: number } {
		return { ...this.#inventory };
	}

	startNewChapter (params: SceneParams): void {
		const { chapterKey, sceneKey } = params;
		this.#activeChapters[chapterKey] = sceneKey;
	}

	getChapterData (chapterKey: string): SavedChapterData {
		return {
			isUnlocked: !!(this.#unlockedChapters.find((x) => x === chapterKey)),
			wasCompleted: !!(this.#completedChapters.find((x) => x === chapterKey)),
			queuedScene: this.#activeChapters[chapterKey] || '',
		};
	}

	queueScene (params: SceneParams): void {
		const { chapterKey, sceneKey } = params;
		this.#activeChapters[chapterKey] = sceneKey;
	}

	unlockChapter (unlockedChapter: string): void {
		this.#unlockedChapters.push(unlockedChapter);
	}

	unlockAchievement (newAchievement: string): void {
		this.#achievements.push(newAchievement);
	}

	updateCharacterTrait (params: TraitParams): void {
		const { character, trait, change } = params;
		const characterData = this.#characters[character];

		if (!characterData) {
			throw new Error('Cannot modify data for unknown characters.');
		}

		characterData.updateTrait({ trait, change }) ;
	}

	addMemoryToCharacter (params: MemoryParams): void {
		const { character, memory } = params;
		const characterData = this.#characters[character];

		if (!characterData) {
			throw new Error('Cannot modify data for unknown characters.');
		}

		characterData.addMemory({ memory });
	}

	removeMemoryFromCharacter (params: MemoryParams): void {
		const { character, memory } = params;
		const characterData = this.#characters[character];

		if (!characterData) {
			throw new Error('Cannot modify data for unknown characters.');
		}

		characterData.removeMemory({ memory });
	}

	addInventoryItem (params: InventoryItem): void {
		const { item, quantity } = params;
		this.#warnIfTooPrecise(quantity);
		this.#inventory[item] = this.#inventory[item] ?? 0;
		this.#inventory[item] = this.#correctMaths(this.#inventory[item] + quantity);
	}

	removeInventoryItem (params: InventoryItem): void {
		const { item, quantity } = params;
		this.#warnIfTooPrecise(quantity);
		this.#inventory[item] = this.#inventory[item] ?? 0;
		this.#inventory[item] = this.#correctMaths(this.#inventory[item] - quantity);
		if (this.#inventory[item] <= 0) {
			delete this.#inventory[item];
		}
	}

	getQueuedSceneForChapter (chapterKey: string) {
		return this.#activeChapters[chapterKey];
	}

	completeChapter (chapterKey: string): void {
		this.#completedChapters.push(chapterKey);
		delete this.#activeChapters[chapterKey];
	}

	addMissingCharacters (characters: CharacterTemplate[]) {
		characters.forEach((char) => {
			if (this.#characters[char.key]) {
				return;
			}

			this.#characters[char.key] = new Character({ ...char, memories: [] });
		});
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

	#correctMaths (n: number) {
		return Math.round(n * 1000) / 1000;
	}

	#warnIfTooPrecise (change: number) {
		const numberOfDecimals = `${change}`.split('.').length;
		if (numberOfDecimals > 3) {
			console.warn(`Math precision is only guaranteed to 3 decimal places.  Doing math on a number with ${numberOfDecimals} places`);
		}
	}
}