export const NARRATOR = 'Narrator';
export class Beat {
	key;
	#defaultCharacter = NARRATOR;
	#queuedScenes;
	#unlockedChapters;
	#unlockedAchievements;
	#addedItems;
	#removedItems;
	#addedMemories;
	#removedMemories;
	#updatedCharacterTraits;
	constructor (params) {
		const { key, saveData } = params;
		this.key = key;
		this.#queuedScenes = saveData?.queuedScenes || [];
		this.#unlockedChapters = saveData?.unlockedChapters || [];
		this.#unlockedAchievements = saveData?.unlockedAchievements || [];
		this.#addedItems = saveData?.addedItems || [];
		this.#removedItems = saveData?.removedItems || [];
		this.#addedMemories = saveData?.addedMemories || [];
		this.#removedMemories = saveData?.removedMemories || [];
		this.#updatedCharacterTraits = saveData?.updatedCharacterTraits || [];
	}
	createSaveDataSideEffects () {
		return {
			queuedScenes: this.#queuedScenes.map((x) => ({ ...x })),
			unlockedChapters: [...this.#unlockedChapters],
			unlockedAchievements: [...this.#unlockedAchievements],
			addedItems: this.#addedItems.map((x) => ({ ...x })),
			removedItems: this.#removedItems.map((x) => ({ ...x })),
			addedMemories: this.#addedMemories.map((x) => ({ ...x })),
			removedMemories: this.#removedMemories.map((x) => ({ ...x })),
			updatedCharacterTraits: this.#updatedCharacterTraits.map((x) => ({ ...x })),
		};
	}
	getCharacter (params) {
		const { character, characters } = params;
		if (!character) {
			return this.#defaultCharacter;
		}
		return characters[character]?.name || this.#defaultCharacter;
	}
	assembleStandardBeatDisplay (params) {
		const { characters, beat: { text, character, nextBeat, sceneData } } = params;
		const characterName = this.getCharacter({
			character,
			characters,
		});
		const saveData = this.createSaveDataSideEffects();
		return {
			speaker: characterName,
			text,
			nextBeat,
			saveData,
			sceneData,
		};
	}
}
