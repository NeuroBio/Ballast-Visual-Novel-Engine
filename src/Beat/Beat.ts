import { Character } from '../Character/Character';
import { InventoryItem, MemoryParams, SceneParams, SentimentParams } from '../SavedData/SavedData';
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

export interface PlayParams {
	characters: { [characterKey: string]: Character };
}

export abstract class Beat {
	protected character: string;
	#queuedScenes: SceneParams[];
	#unlockedChapters: string[];
	#unlockedAchievements: string[];
	#addedItems: InventoryItem[];
	#removedItems: InventoryItem[];
	#addedMemories: MemoryParams[];
	#removedMemories: MemoryParams[];
	#updatedCharacterSentiments: SentimentParams[];

	constructor (params: BeatParams) {
		const { character, queuedScenes, unlockedChapters, unlockedAchievements,
			addedItems, removedItems, addedMemories, removedMemories,
			updatedCharacterSentiments } = params;
		this.character = character || NARRATOR;
		this.#queuedScenes = queuedScenes || [];
		this.#unlockedChapters = unlockedChapters || [];
		this.#unlockedAchievements = unlockedAchievements || [];
		this.#addedItems = addedItems || [];
		this.#removedItems = removedItems || [];
		this.#addedMemories = addedMemories || [];
		this.#removedMemories = removedMemories || [];
		this.#updatedCharacterSentiments = updatedCharacterSentiments || [];
	}

	abstract play (params: PlayParams): StandardBeatDisplay | ChoiceBeatDisplay | FinalBeatDisplay;

	get queuedScenes (): SceneParams[] {
		return this.#queuedScenes.map((x) => ({ ...x }));
	}

	get unlockedChapters (): string[] {
		return [...this.#unlockedChapters];
	}

	get unlockedAchievements (): string[] {
		return [...this.#unlockedAchievements];
	}

	get addedItems (): InventoryItem[] {
		return this.#addedItems.map((x) => ({ ...x }));
	}

	get removedItems (): InventoryItem[] {
		return this.#removedItems.map((x) => ({ ...x }));
	}

	get addedMemories (): MemoryParams[] {
		return this.#addedMemories.map((x) => ({ ...x }));
	}

	get removedMemories (): MemoryParams[] {
		return this.#removedMemories.map((x) => ({ ...x }));
	}

	get updatedCharacterSentiments (): SentimentParams[] {
		return this.#updatedCharacterSentiments.map((x) => ({ ...x }));
	}
}