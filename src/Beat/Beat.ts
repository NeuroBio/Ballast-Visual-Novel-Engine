import { Character } from '../Character/Character';
import { InventoryItemParams, SentimentParams } from '../SavedData/SavedData';
import { SharedBeatParams } from './BeatFactory';

export const NARRATOR = 'Narrator';

export interface BeatParams extends SharedBeatParams {
	character?: string;
}

export interface StandardBeatDisplay {
	text: string;
	nextBeat: string;
}

export interface ChoiceBeatDisplay {
	choices: StandardBeatDisplay[];
}

export interface FinalBeatDisplay {
	text: string;
}


export abstract class Beat {
	protected character: string;
	protected speaker: string;
	#queuedScenes: string[];
	#unlockedChapters: string[];
	#unlockedAchievements: string[];
	#addedItems: InventoryItemParams[];
	#removedItems: InventoryItemParams[];
	#addedMemories: string[];
	#removedMemories: string[];
	#updatedSentimentsForCharacters: SentimentParams[];

	constructor (params: BeatParams) {
		const { character, queuedScenes, unlockedChapters, unlockedAchievements,
			addedItems, removedItems, addedMemories, removedMemories,
			updatedSentimentsForCharacters } = params;
		this.speaker = character || NARRATOR;
		this.character = character || NARRATOR;
		this.#queuedScenes = queuedScenes || [];
		this.#unlockedChapters = unlockedChapters || [];
		this.#unlockedAchievements = unlockedAchievements || [];
		this.#addedItems = addedItems || [];
		this.#removedItems = removedItems || [];
		this.#addedMemories = addedMemories || [];
		this.#removedMemories = removedMemories || [];
		this.#updatedSentimentsForCharacters = updatedSentimentsForCharacters || [];
	}

	abstract play (characters: { [characterKey: string]: Character }): StandardBeatDisplay | ChoiceBeatDisplay | FinalBeatDisplay;

	get queuedScenes (): string[] {
		return [...this.#queuedScenes];
	}

	get unlockedChapters (): string[] {
		return [...this.#unlockedChapters];
	}

	get unlockedAchievements (): string[] {
		return [...this.#unlockedAchievements];
	}

	get addedItems (): InventoryItemParams[] {
		return this.#addedItems.map((x) => ({ ...x }));
	}

	get removedItems (): InventoryItemParams[] {
		return this.#removedItems.map((x) => ({ ...x }));
	}

	get addedMemories (): string[] {
		return [...this.#addedMemories];
	}

	get removedMemories (): string[] {
		return [...this.#removedMemories];
	}

	get updatedSentimentsForCharacters (): SentimentParams[] {
		return this.#updatedSentimentsForCharacters.map((x) => ({ ...x }));
	}
}