import { Beat, PlayParams } from './Beat';
import { FinalBeat } from './FinalBeat';
import { ChoiceBeat } from './ChoiceBeat';
import { SimpleBeat } from './SimpleBeat';
import { InventoryItem, MemoryParams, SceneParams, TraitParams } from '../SavedData/SavedData';
import { FirstFitBranchBeat } from './FirstFitBranchBeat';
import { MultiResponseBeat } from './MultiResponseBeat';
import { BestFitBranchBeat } from './BestFitBranchBeat';
import { Character } from '../Character/Character';

export enum SingleConditionType {
	AT_LEAST_ITEM = 'itemEqual+',
	AT_MOST_ITEM = 'itemEqual-',
	CHARACTER_AWARE = 'hasMemory',
	CHARACTER_UNAWARE = 'lacksMemory',
	AT_LEAST_CHAR_TRAIT = 'charTraitEqual+',
	AT_MOST_CHAR_TRAIT = 'charTraitEqual-',
}

export enum CrossConditionType {
	GREATEST_SENTIMENT = 'charMost',
	LEAST_SENTIMENT = 'charLeast',
}
interface ItemCondition {
	type: SingleConditionType.AT_LEAST_ITEM | SingleConditionType.AT_MOST_ITEM;
	item: string;
	quantity: number;
}

interface MemoryCondition {
	type: SingleConditionType.CHARACTER_AWARE | SingleConditionType.CHARACTER_UNAWARE;
	character: string;
	memory: string;
}

interface TraitLimitCondition {
	type: SingleConditionType.AT_LEAST_CHAR_TRAIT | SingleConditionType.AT_MOST_CHAR_TRAIT;
	character: string;
	trait: string;
	value: number;
}

interface TraitMaxMinCondition {
	type: CrossConditionType.GREATEST_SENTIMENT | CrossConditionType.LEAST_SENTIMENT;
	trait: string;
}

type CrossCondition = TraitMaxMinCondition;

type SingleCriterion = ItemCondition | MemoryCondition | TraitLimitCondition;

export interface CrossConditionParams {
	characters: Character[];
}

interface Choice {
	text: string;
	nextBeat: string;
	conditions?: SingleCriterion[];
	SceneUpdates?: SceneUpdates;
}

interface Branch extends DisplaySideEffects {
	text: string;
	character?: string,
	nextBeat: string;
	conditions?: SingleCriterion[];
	SceneUpdates?: SceneUpdates;
}

interface BestFitBranch extends DisplaySideEffects {
	text: string;
	character: string,
	nextBeat: string;
	conditions?: SingleCriterion[];
	SceneUpdates?: SceneUpdates;
}

interface Response extends DisplaySideEffects {
	text: string,
	character?: string,
	nextBeat?: string;
	conditions?: SingleCriterion[];
	SceneUpdates?: SceneUpdates
}

export interface DefaultBehavior extends DisplaySideEffects {
	text: string;
	character?: string;
	nextBeat?: string;
	SceneUpdates?: SceneUpdates
}

interface SceneUpdates {
	setBackground?: string;
	updateCharacterSprite?: { character: string, sprite: string }[];
	moveCharacter?: { character: string, newPosition: number }[];
	removeCharacter?: { character: string }[];
	addCharacter?: { character: string, position: number, sprite: string }[];
}

export interface DisplaySideEffects {
	setBackground?: string;
	updateCharacterSprites?: [{
		character: string,
		sprite: string,
	}];
	moveCharacters?: [{
		character: string,
		newPosition: number
	}];
	removeCharacters?: [{ character: string }];
	addCharacters?: [{
		character: string,
		position: number,
		sprite: string
	}];
}

export interface SaveDataSideEffectsDto {
	queuedScenes?: SceneParams[];
	unlockedChapters?: string[];
	unlockedAchievements?: string[];
	addedItems?: InventoryItem[];
	removedItems?: InventoryItem[];
	addedMemories?: MemoryParams[];
	removedMemories?: MemoryParams[];
	updatedCharacterTraits?: TraitParams[];
}
export interface SharedBeatParams {
	key: string;
	saveDataSideEffects?: SaveDataSideEffectsDto;
}

export interface BeatDto extends SharedBeatParams {
	defaultBehavior?: DefaultBehavior;
	choices?: Choice[];
	branches?: Branch[],
	crossBranchCondition?: TraitMaxMinCondition;
	responses?: Response[]
}

interface DefaultBehaviorStandard extends DisplaySideEffects{
	text: string;
	character?: string;
	nextBeat: string;
}

interface DefaultBehaviorFinal extends DisplaySideEffects{
	text: string;
	character?: string;
}
interface SimpleBeatParams extends SharedBeatParams {
	defaultBehavior: DefaultBehaviorStandard;
}

interface FinalBeatParams extends SharedBeatParams {
	defaultBehavior: DefaultBehaviorFinal;
}

interface ChoiceBeatParams extends SharedBeatParams {
	choices: Choice[];
	defaultBehavior?: DefaultBehaviorStandard;
}

interface FirstFitBranchBeatParams extends SharedBeatParams {
	branches: BestFitBranch[];
	defaultBehavior: DefaultBehaviorStandard;
}

interface BestFitBranchBeatParams extends SharedBeatParams {
	branches: BestFitBranch[];
	crossBranchCondition: TraitMaxMinCondition;
	defaultBehavior?: DefaultBehaviorStandard;
}

interface MultiResponseBeatParams extends SharedBeatParams {
	responses: Response[];
	defaultBehavior: DefaultBehaviorStandard;
}

export class BeatFactory {
	fromDto (dto: BeatDto): Beat {
		if (this.#isSimpleBeat(dto)) {
			return this.#createSimpleBeat(dto);
		}

		if (this.#isChoiceBeat(dto)) {
			return this.#createChoiceBeat(dto);
		}

		if (this.#isFirstFitBranchBeat(dto)) {
			return this.#createFirstFitBranchBeat(dto);
		}

		if (this.#isBestFitBranchBeat(dto)) {
			return this.#createBestFitBranchBeat(dto);
		}

		if (this.#isMultiResponseBeat(dto)) {
			return this.#createMultiResponseBeat(dto);
		}

		if (this.#isFinalBeat(dto)) {
			return this.#createFinalBeat(dto);
		}

		throw new Error(`Received malformed beat data for ${dto.key}.  See the documentation for expected shapes for different beat types.`);
	}

	#createSimpleBeat (dto: SimpleBeatParams): SimpleBeat {
		const params = {
			defaultBehavior: dto.defaultBehavior,
			...this.#setSharedParams(dto),
		};
		return new SimpleBeat(params);
	}

	#createFinalBeat (dto: FinalBeatParams): FinalBeat {
		const params = {
			character: dto.defaultBehavior.character,
			text: dto.defaultBehavior.text,
			...this.#setSharedParams(dto),
		};
		return new FinalBeat(params);
	}

	#createChoiceBeat (dto: ChoiceBeatParams): ChoiceBeat {
		const params = {
			choices: dto.choices.map((choice) => ({
				beat: { text: choice.text, nextBeat: choice.nextBeat },
				conditions: this.#createSingleCondition(choice.conditions || []) || [],
			})),
			defaultBehavior: dto.defaultBehavior,
			...this.#setSharedParams(dto),
		};
		return new ChoiceBeat(params);
	}

	#createFirstFitBranchBeat (dto: FirstFitBranchBeatParams): FirstFitBranchBeat {
		const params = {
			branches: dto.branches.map((branch) => ({
				beat: { text: branch.text, nextBeat: branch.nextBeat, character: branch.character },
				conditions: this.#createSingleCondition(branch.conditions || []) || [],
			})),
			defaultBehavior: dto.defaultBehavior,
			...this.#setSharedParams(dto),
		};
		return new FirstFitBranchBeat(params);
	}

	#createMultiResponseBeat (dto: MultiResponseBeatParams): MultiResponseBeat {
		const params = {
			responses: dto.responses.map((response) => ({
				beat: { text: response.text, nextBeat: response.nextBeat, character: response.character },
				conditions: this.#createSingleCondition(response.conditions || []) || [],
			})),
			defaultBehavior: dto.defaultBehavior,
			...this.#setSharedParams(dto),
		};
		return new MultiResponseBeat(params);
	}

	#createBestFitBranchBeat (dto: BestFitBranchBeatParams): BestFitBranchBeat {
		const params = {
			branches: dto.branches.map((branch) => ({
				beat: { text: branch.text, nextBeat: branch.nextBeat, character: branch.character },
				conditions: this.#createSingleCondition(branch.conditions || []) || [],
			})),
			crossBranchCondition: this.#createCrossCondition(dto.crossBranchCondition),
			defaultBehavior: dto.defaultBehavior,
			...this.#setSharedParams(dto),
		};
		return new BestFitBranchBeat(params);
	}

	#createSingleCondition (conditions: SingleCriterion[]) {
		return conditions.map((condition) => {
			switch (condition.type) {
			case SingleConditionType.AT_LEAST_ITEM: {
				const { item, quantity } = condition;
				return (params: PlayParams) =>
					(params.inventory[item] || 0) >= quantity;
			}

			case SingleConditionType.AT_MOST_ITEM: {
				const { item, quantity } = condition;
				return (params: PlayParams) =>
					(params.inventory[item] || 0) <= quantity;
			}

			case SingleConditionType.CHARACTER_AWARE: {
				const { character, memory } = condition;
				return (params: PlayParams) =>
					params.characters[character]?.hasMemory(memory) || false;
			}

			case SingleConditionType.CHARACTER_UNAWARE: {
				const { character, memory } = condition;
				return (params: PlayParams) =>
					!params.characters[character]?.hasMemory(memory) || false;
			}

			case SingleConditionType.AT_LEAST_CHAR_TRAIT: {
				const { character, trait, value } = condition;
				return (params: PlayParams) =>
					params.characters[character]?.traits[trait] >= value || false;
			}

			case SingleConditionType.AT_MOST_CHAR_TRAIT: {
				const { character, trait, value } = condition;
				return (params: PlayParams) =>
					params.characters[character]?.traits[trait] <= value || false;
			}

			default: throw new Error('Not a real condition'); // not tested
			}
		});
	}

	#createCrossCondition (condition: CrossCondition) {
		switch (condition.type) {
		case CrossConditionType.GREATEST_SENTIMENT: {
			return (params: CrossConditionParams): string => {
				const { characters } = params;
				let maxChar = characters[0];
				characters.forEach((char) => {
					if (char.traits[condition.trait] > maxChar.traits[condition.trait]) {
						maxChar = char;
					}
				});

				return maxChar.key;
			};
		}

		case CrossConditionType.LEAST_SENTIMENT: {
			return (params: CrossConditionParams): string => {
				const { characters } = params;
				let minChar = characters[0];
				characters.forEach((char) => {
					if (char.traits[condition.trait] < minChar.traits[condition.trait]) {
						minChar = char;
					}
				});

				return minChar.key;
			};
		}

		default: throw new Error('Not a real condition'); // not tested
		}
	}

	#setSharedParams (dto: BeatDto): SharedBeatParams {
		return {
			key: dto.key,
			saveDataSideEffects: {
				queuedScenes: dto.saveDataSideEffects?.queuedScenes,
				unlockedChapters: dto.saveDataSideEffects?.unlockedChapters,
				unlockedAchievements: dto.saveDataSideEffects?.unlockedAchievements,
				addedItems: dto.saveDataSideEffects?.addedItems,
				removedItems: dto.saveDataSideEffects?.removedItems,
				addedMemories: dto.saveDataSideEffects?.addedMemories,
				removedMemories: dto.saveDataSideEffects?.removedMemories,
				updatedCharacterTraits: dto.saveDataSideEffects?.updatedCharacterTraits,
			},
		};
	}

	#isSimpleBeat (dto: BeatDto): dto is SimpleBeatParams {
		if (dto.choices || dto.responses || dto.branches || dto.crossBranchCondition) {
			return false;
		}

		if (!dto.defaultBehavior) {
			return false;
		}

		this.#validateSideEffects(dto.key, dto.defaultBehavior);

		return !!(dto.defaultBehavior.text && dto.defaultBehavior.nextBeat);
	}

	#isFinalBeat (dto: BeatDto): dto is FinalBeatParams {
		if (dto.choices || dto.responses || dto.branches || dto.crossBranchCondition) {
			return false;
		}

		if (!dto.defaultBehavior) {
			return false;
		}

		this.#validateSideEffects(dto.key, dto.defaultBehavior);

		return !!(dto.defaultBehavior.text && !dto.defaultBehavior.nextBeat);
	}

	#isChoiceBeat (dto: BeatDto): dto is ChoiceBeatParams {
		if (dto.responses || dto.branches || !dto.choices || dto.crossBranchCondition) {
			return false;
		}

		for (const choice of dto.choices) {
			if (!choice.text || !choice.nextBeat) {
				return false;
			}
		}

		if (dto.defaultBehavior) {
			return !!(dto.defaultBehavior.text && dto.defaultBehavior.nextBeat);
		}

		return true;
	}

	#isFirstFitBranchBeat (dto: BeatDto): dto is FirstFitBranchBeatParams {
		if (dto.responses || !dto.branches || dto.choices || !dto.defaultBehavior || dto.crossBranchCondition) {
			return false;
		}

		for (const branch of dto.branches) {
			if (!branch.text || !branch.nextBeat || !branch.conditions) {
				return false;
			}
			this.#validateSideEffects(dto.key, dto.defaultBehavior);
		}

		if (dto.defaultBehavior) {
			this.#validateSideEffects(dto.key, dto.defaultBehavior);
			return !!(dto.defaultBehavior.text && dto.defaultBehavior.nextBeat);
		}

		return true;
	}

	#isMultiResponseBeat (dto: BeatDto): dto is MultiResponseBeatParams {
		if (!dto.responses || dto.branches || dto.choices || !dto.defaultBehavior || dto.crossBranchCondition) {
			return false;
		}

		for (const response of dto.responses) {
			if (!response.text) {
				return false;
			}
			this.#validateSideEffects(dto.key, dto.defaultBehavior);
		}

		this.#validateSideEffects(dto.key, dto.defaultBehavior);
		return !!(dto.defaultBehavior.text && dto.defaultBehavior.nextBeat);
	}

	#isBestFitBranchBeat (dto: BeatDto): dto is BestFitBranchBeatParams {
		if (dto.responses || !dto.branches || dto.choices || !dto.crossBranchCondition) {
			return false;
		}

		for (const branch of dto.branches) {
			if (!branch.text || !branch.nextBeat || !branch.character) {
				return false;
			}
		}

		if (dto.defaultBehavior) {
			return !!(dto.defaultBehavior.text && dto.defaultBehavior.nextBeat);
		}

		return true;
	}

	/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
	#validateSideEffects (key: string, data: any): boolean {
		const errorMessage = `Received malformed display side effect data for ${key}.  See the documentation for expected shapes for side effects.`;

		if (Object.hasOwn(data, 'setBackground')) {
			if (!data.setBackground) {
				throw new Error(errorMessage);
			}
		}

		if (Object.hasOwn(data, 'updateCharacterSprites')) {
			/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
			data.updateCharacterSprites.forEach((x: any) => {
				if (!x.character || !x.sprite) {
					throw new Error(errorMessage);
				}
			});
		}

		if (Object.hasOwn(data, 'moveCharacters')) {
			/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
			data.moveCharacters.forEach((x: any) => {
				if (!x.character || !_isInt(x.newPosition)) {
					throw new Error(errorMessage);
				}
			});
		}

		if (Object.hasOwn(data, 'removeCharacters')) {
			/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
			data.removeCharacters.forEach((x: any) => {
				if (!x.character) {
					throw new Error(errorMessage);
				}
			});
		}

		if (Object.hasOwn(data, 'addCharacters')) {
			/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
			data.addCharacters.forEach((x: any) => {
				if (!x.character || !x.sprite || !_isInt(x.position)) {
					throw new Error(errorMessage);
				}
			});
		}
		return true;

		/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
		function _isInt (data: any): boolean {
			if (!data && data !== 0) {
				return false;
			}

			return data % 1 === 0;
		}
	}
}
