import { Character } from '../Character/Character';
import { InventoryItem, MemoryParams, SceneParams, TraitParams } from '../SavedData/SavedData';
import { DisplaySideEffects } from './SharedInterfaces';

export const NARRATOR = 'Narrator';

export interface StandardBeatDisplay {
	speaker?: string;
	text: string;
	nextBeat: string;
	saveData: SaveDataSideEffects;
	sceneData: DisplaySideEffects;
}

interface ChoiceBehavior {
	mayPlay: boolean;
}

export interface ChoiceBeatDisplay {
	choices: ChoiceBehavior[];
	saveData: SaveDataSideEffects;
	default?: StandardBeatDisplay;
}

export interface FinalBeatDisplay {
	speaker: string;
	text: string;
	saveData: SaveDataSideEffects;
	sceneData: DisplaySideEffects;
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

export interface SharedBeatParams {
	key: string;
	saveData: SaveDataSideEffects;
}

interface GetCharacterParams {
	characters: { [characterKey: string]: Character },
	character: string | undefined;
}

interface DisplayParams {
	text: string;
	character?: string;
	nextBeat: string;
	sceneData: DisplaySideEffects;
}

interface AssembleStandardBeatDisplayParams {
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