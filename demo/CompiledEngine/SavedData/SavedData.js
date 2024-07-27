import { Character } from '../Character/Character.js';
export class SavedData {
	#activeChapters;
	#unlockedChapters;
	#completedChapters;
	#inventory;
	#achievements;
	#characters;
	constructor (params) {
		const { activeChapters, unlockedChapters, completedChapters, characters, inventory, achievements } = params;
		this.#activeChapters = activeChapters;
		this.#unlockedChapters = unlockedChapters;
		this.#completedChapters = completedChapters;
		this.#inventory = inventory;
		this.#achievements = achievements;
		this.#characters = characters.reduce((keyed, dto) => {
			keyed[dto.key] = new Character(dto);
			return keyed;
		}, {});
	}
	get characters () {
		return Object.keys(this.#characters).reduce((keyed, key) => {
			keyed[key] = this.#characters[key].clone();
			return keyed;
		}, {});
	}
	get achievementKeys () {
		return [...this.#achievements];
	}
	get completedChaptersKeys () {
		return [...this.#completedChapters];
	}
	get inventory () {
		return { ...this.#inventory };
	}
	startNewChapter (params) {
		const { chapterKey, sceneKey } = params;
		this.#activeChapters[chapterKey] = sceneKey;
	}
	getChapterData (chapterKey) {
		return {
			isUnlocked: !!(this.#unlockedChapters.find((x) => x === chapterKey)),
			wasCompleted: !!(this.#completedChapters.find((x) => x === chapterKey)),
			queuedScene: this.#activeChapters[chapterKey] || '',
		};
	}
	queueScene (params) {
		const { chapterKey, sceneKey } = params;
		this.#activeChapters[chapterKey] = sceneKey;
	}
	unlockChapter (unlockedChapter) {
		this.#unlockedChapters.push(unlockedChapter);
	}
	unlockAchievement (newAchievement) {
		this.#achievements.push(newAchievement);
	}
	updateCharacterTrait (params) {
		const { character, trait, change } = params;
		const characterData = this.#characters[character];
		if (!characterData) {
			throw new Error('Cannot modify data for unknown characters.');
		}
		characterData.updateTrait({ trait, change });
	}
	addMemoryToCharacter (params) {
		const { character, memory } = params;
		const characterData = this.#characters[character];
		if (!characterData) {
			throw new Error('Cannot modify data for unknown characters.');
		}
		characterData.addMemory({ memory });
	}
	removeMemoryFromCharacter (params) {
		const { character, memory } = params;
		const characterData = this.#characters[character];
		if (!characterData) {
			throw new Error('Cannot modify data for unknown characters.');
		}
		characterData.removeMemory({ memory });
	}
	addInventoryItem (params) {
		const { item, quantity } = params;
		this.#warnIfTooPrecise(quantity);
		this.#inventory[item] = this.#inventory[item] ?? 0;
		this.#inventory[item] = this.#correctMaths(this.#inventory[item] + quantity);
	}
	removeInventoryItem (params) {
		const { item, quantity } = params;
		this.#warnIfTooPrecise(quantity);
		this.#inventory[item] = this.#inventory[item] ?? 0;
		this.#inventory[item] = this.#correctMaths(this.#inventory[item] - quantity);
		if (this.#inventory[item] <= 0) {
			delete this.#inventory[item];
		}
	}
	getQueuedSceneForChapter (chapterKey) {
		return this.#activeChapters[chapterKey];
	}
	completeChapter (chapterKey) {
		this.#completedChapters.push(chapterKey);
		delete this.#activeChapters[chapterKey];
	}
	addMissingCharacters (characters) {
		characters.forEach((char) => {
			if (this.#characters[char.key]) {
				return;
			}
			this.#characters[char.key] = new Character({ ...char, memories: [] });
		});
	}
	toDto () {
		return {
			activeChapters: { ...this.#activeChapters },
			unlockedChapters: [...this.#unlockedChapters],
			completedChapters: [...this.#completedChapters],
			inventory: { ...this.#inventory },
			achievements: [...this.#achievements],
			characters: Object.values(this.#characters).map((char) => char.toDto()),
		};
	}
	clone () {
		return new SavedData(this.toDto());
	}
	#correctMaths (n) {
		return Math.round(n * 1000) / 1000;
	}
	#warnIfTooPrecise (change) {
		const numberOfDecimals = `${change}`.split('.').length;
		if (numberOfDecimals > 3) {
			console.warn(`Math precision is only guaranteed to 3 decimal places.  Doing math on a number with ${numberOfDecimals} places`);
		}
	}
}
