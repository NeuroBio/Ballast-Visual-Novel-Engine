import { Character } from '../Character/Character';
import { InventoryItem, MemoryParams, SceneParams, TraitParams } from '../SavedData/SavedData';

export interface DisplaySideEffects {
	setBackground: string;
	updateCharacterSprites: [{
		character: string,
		sprite: string,
	}];
	moveCharacters: [{
		character: string,
		newPosition: number
	}];
	removeCharacters: [{ character: string }];
	addCharacters: [{
		character: string,
		position: number,
		sprite: string
	}];
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

export interface DefaultBehaviorStandard {
	text: string;
	character?: string;
	nextBeat: string;
	sceneData: DisplaySideEffects;
}

export interface CrossConditionParams {
	characters: Character[];
}