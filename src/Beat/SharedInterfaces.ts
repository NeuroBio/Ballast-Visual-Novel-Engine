import { Character } from '../Character/Character';
import { InventoryItem, MemoryParams, SceneParams, TraitParams } from '../SavedData/SavedData';

interface UpdateCharacterSpriteParams {
	character: string,
	sprite: string,
}

interface MoveCharacterParams {
	character: string,
	newPosition: number
}

interface RemoveCharacterParams {
	character: string
}

interface AddCharacterParams {
	character: string,
	position: number,
	sprite: string
}
export interface DisplaySideEffects {
	setBackground: string;
	updateCharacterSprites: UpdateCharacterSpriteParams[];
	moveCharacters: MoveCharacterParams[];
	removeCharacters: RemoveCharacterParams[];
	addCharacters: AddCharacterParams[];
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