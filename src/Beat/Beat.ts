import { Character } from '../Character/Character';
import { InventoryItem, MemoryParams, SceneParams, TraitParams } from '../SavedData/SavedData';
import { DefaultBehavior, DisplaySideEffects, SharedBeatParams } from './BeatFactory';

export const NARRATOR = 'Narrator';

export interface StandardBeatDisplay extends DisplaySideEffects {
	speaker?: string;
	text: string;
	nextBeat: string;
	saveData: SaveDataSideEffects;
}

export interface ChoiceBeatDisplay {
	choices: DefaultBehavior[];
	saveData: SaveDataSideEffects;
}

export interface FinalBeatDisplay extends DisplaySideEffects {
	speaker: string;
	text: string;
	saveData: SaveDataSideEffects;
}

export interface SaveDataSideEffects {
	queuedScenes: SceneParams[];
	unlockedChapters: string[];
	unlockedAchievements: string[];
	addedItems: InventoryItem[];
	removedItems: InventoryItem[];
	addedMemories: MemoryParams[];
	removedMemories: MemoryParams[];
	updatedCharacterTraits: TraitParams[];
}

export interface PlayParams {
	characters: { [characterKey: string]: Character };
	inventory: { [itemKey: string]: number };
	scene: { characters: Set<string> };
}

interface GetCharacterParams {
	characters: { [characterKey: string]: Character },
	character: string | undefined;
}

interface DisplayParams {
	text: string;
	character?: string;
	nextBeat: string;
}

interface AssembleStandardBeatDisplayParams extends DisplaySideEffects {
	characters: { [characterKey: string]: Character };
	beat: DisplayParams;
}

export abstract class Beat {
	protected key: string;
	#defaultCharacter = NARRATOR;
	#queuedScenes: SceneParams[];
	#unlockedChapters: string[];
	#unlockedAchievements: string[];
	#addedItems: InventoryItem[];
	#removedItems: InventoryItem[];
	#addedMemories: MemoryParams[];
	#removedMemories: MemoryParams[];
	#updatedCharacterTraits: TraitParams[];

	constructor (params: SharedBeatParams) {
		const { key, saveDataSideEffects } = params;

		this.key = key;
		this.#queuedScenes = saveDataSideEffects?.queuedScenes || [];
		this.#unlockedChapters = saveDataSideEffects?.unlockedChapters || [];
		this.#unlockedAchievements = saveDataSideEffects?.unlockedAchievements || [];
		this.#addedItems = saveDataSideEffects?.addedItems || [];
		this.#removedItems = saveDataSideEffects?.removedItems || [];
		this.#addedMemories = saveDataSideEffects?.addedMemories || [];
		this.#removedMemories = saveDataSideEffects?.removedMemories || [];
		this.#updatedCharacterTraits = saveDataSideEffects?.updatedCharacterTraits || [];
	}

	get saveDataSideEffects (): SaveDataSideEffects {
		return this.createSaveDataSideEffects();
	}

	protected createSaveDataSideEffects (): SaveDataSideEffects {
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


	abstract play (params: PlayParams): StandardBeatDisplay | ChoiceBeatDisplay | FinalBeatDisplay;

	protected getCharacter (params: GetCharacterParams): string {
		const { character, characters } = params;
		if (!character) {
			return this.#defaultCharacter;
		}
		return characters[character]?.name || this.#defaultCharacter;
	}

	protected assembleStandardBeatDisplay (params: AssembleStandardBeatDisplayParams) {
		const { characters, beat: { text, character, nextBeat } } = params;
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
		};
		// apply display
		// update all beats to pass display
	}
}