import { Beat, PlayParams, SharedBeatParams } from './Beat';
import { FinalBeat, FinalBeatParams } from './FinalBeat';
import { ChoiceBeat, ChoiceBeatParams } from './ChoiceBeat';
import { SimpleBeat, SimpleBeatParams } from './SimpleBeat';
import { InventoryItem, MemoryParams, SceneParams, TraitParams } from '../SavedData/SavedData';
import { FirstFitBranchBeat, FirstFitBranchBeatParams } from './FirstFitBranchBeat';
import { MultiResponseBeat, MultiResponseBeatParams } from './MultiResponseBeat';
import { BestFitBranchBeat, BestFitBranchBeatParams } from './BestFitBranchBeat';
import { CrossConditionParams, DisplaySideEffects } from './SharedInterfaces';

// conditionals
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

type CrossConditionDto = TraitMaxMinCondition;

type SingleCriterionDto = ItemCondition | MemoryCondition | TraitLimitCondition;


// Storage
interface DisplaySideEffectsDto {
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
interface DefaultBehaviorDto {
	text: string;
	character?: string;
	nextBeat?: string;
	sceneData?: DisplaySideEffectsDto;
}
export interface ChoiceDto {
	text: string;
	nextBeat: string;
	conditions?: SingleCriterionDto[];
}

interface FirstFitBranchDto {
	text: string;
	character?: string,
	nextBeat: string;
	conditions?: SingleCriterionDto[];
	sceneData?: DisplaySideEffectsDto;
}

interface BestFitBranchDto {
	text: string;
	character: string,
	nextBeat: string;
	conditions?: SingleCriterionDto[];
	sceneData?: DisplaySideEffectsDto;
}

interface ResponseDto {
	text: string,
	character?: string,
	nextBeat?: string;
	conditions?: SingleCriterionDto[];
	sceneData?: DisplaySideEffectsDto;
}

interface SaveDataSideEffectsDto {
	queuedScenes?: SceneParams[];
	unlockedChapters?: string[];
	unlockedAchievements?: string[];
	addedItems?: InventoryItem[];
	removedItems?: InventoryItem[];
	addedMemories?: MemoryParams[];
	removedMemories?: MemoryParams[];
	updatedCharacterTraits?: TraitParams[];
}

export interface BeatDto {
	key: string;
	choices?: ChoiceDto[];
	responses?: ResponseDto[];
	branches?: FirstFitBranchDto[] | BestFitBranchDto[];
	crossBranchCondition?: CrossConditionDto;
	defaultBehavior?: DefaultBehaviorDto;
	saveData?: SaveDataSideEffectsDto;
}

// construction
interface SimpleBeatDto {
	key: string;
	defaultBehavior: {
		text: string;
		character?: string;
		nextBeat: string;
		sceneData?: DisplaySideEffectsDto;
	};
	saveData?: SaveDataSideEffectsDto;
}

interface ChoiceBeatDto {
	key: string;
	choices: ChoiceDto[];
	defaultBehavior?: {
		text: string;
		character?: string;
		nextBeat: string;
		sceneData?: DisplaySideEffectsDto;
	};
	saveData?: SaveDataSideEffectsDto;
}

interface FirstFitBranchBeatDto {
	key: string;
	branches: FirstFitBranchDto[],
	defaultBehavior?: {
		text: string;
		character?: string;
		nextBeat: string;
		sceneData?: DisplaySideEffectsDto;
	};
	saveData?: SaveDataSideEffectsDto;
}

interface BestFitBranchBeatDto {
	key: string;
	branches: BestFitBranchDto[];
	crossBranchCondition: CrossConditionDto;
	defaultBehavior?: {
		text: string;
		character: string;
		nextBeat: string;
		sceneData?: DisplaySideEffectsDto;
	};
	saveData?: SaveDataSideEffectsDto;
}

interface MultiResponseBeatDto {
	key: string;
	responses: ResponseDto[];
	saveData?: SaveDataSideEffectsDto;
	defaultBehavior: {
		text: string;
		character?: string;
		nextBeat: string;
		sceneData?: DisplaySideEffectsDto;
	};
}

interface FinalBeatDto {
	key: string;
	defaultBehavior: {
		text: string;
		character?: string;
		sceneData?: DisplaySideEffectsDto;
	};
	saveData?: SaveDataSideEffectsDto;
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

	#createSimpleBeat (dto: SimpleBeatDto): SimpleBeat {
		const params: SimpleBeatParams = {
			defaultBehavior: {
				character: dto.defaultBehavior.character,
				text: dto.defaultBehavior.text,
				nextBeat: dto.defaultBehavior.nextBeat,
				sceneData: this.#setSceneData(dto.defaultBehavior),
			},
			...this.#setSharedParams(dto),
		};
		return new SimpleBeat(params);
	}

	#createChoiceBeat (dto: ChoiceBeatDto): ChoiceBeat {
		const defaultBehavior = dto.defaultBehavior
			? {
				character: dto.defaultBehavior.character,
				text: dto.defaultBehavior.text,
				nextBeat: dto.defaultBehavior.nextBeat,
				sceneData: this.#setSceneData(dto.defaultBehavior),
			}
			: undefined;
		const params: ChoiceBeatParams = {
			choices: dto.choices.map((choice) => ({
				beat: { text: choice.text, nextBeat: choice.nextBeat, mayPlay: false },
				conditions: this.#createSingleCondition(choice.conditions || []) || [],
			})),
			defaultBehavior,
			...this.#setSharedParams(dto),
		};
		return new ChoiceBeat(params);
	}

	#createFirstFitBranchBeat (dto: FirstFitBranchBeatDto): FirstFitBranchBeat {
		const defaultBehavior = dto.defaultBehavior
			? {
				character: dto.defaultBehavior.character,
				text: dto.defaultBehavior.text,
				nextBeat: dto.defaultBehavior.nextBeat,
				sceneData: this.#setSceneData(dto.defaultBehavior),
			}
			: undefined;
		const params: FirstFitBranchBeatParams = {
			branches: dto.branches.map((branch) => ({
				beat: {
					text: branch.text,
					nextBeat: branch.nextBeat,
					character: branch.character,
					sceneData: this.#setSceneData(dto.defaultBehavior),
				},
				conditions: this.#createSingleCondition(branch.conditions || []) || [],
			})),
			defaultBehavior,
			...this.#setSharedParams(dto),
		};
		return new FirstFitBranchBeat(params);
	}

	#createBestFitBranchBeat (dto: BestFitBranchBeatDto): BestFitBranchBeat {
		const defaultBehavior = dto.defaultBehavior
			? {
				character: dto.defaultBehavior.character,
				text: dto.defaultBehavior.text,
				nextBeat: dto.defaultBehavior.nextBeat,
				sceneData: this.#setSceneData(dto.defaultBehavior),
			}
			: undefined;
		const params: BestFitBranchBeatParams = {
			branches: dto.branches.map((branch) => ({
				beat: {
					text: branch.text,
					nextBeat: branch.nextBeat,
					character: branch.character,
					sceneData: this.#setSceneData(dto.defaultBehavior),
				},
				conditions: this.#createSingleCondition(branch.conditions || []) || [],
			})),
			crossBranchCondition: this.#createCrossCondition(dto.crossBranchCondition),
			defaultBehavior,
			...this.#setSharedParams(dto),
		};
		return new BestFitBranchBeat(params);
	}

	#createMultiResponseBeat (dto: MultiResponseBeatDto): MultiResponseBeat {
		const params: MultiResponseBeatParams = {
			responses: dto.responses.map((response) => ({
				beat: {
					text: response.text,
					nextBeat: response.nextBeat,
					character: response.character,
					sceneData: this.#setSceneData(dto.defaultBehavior),
				},
				conditions: this.#createSingleCondition(response.conditions || []) || [],
			})),
			defaultBehavior: {
				character: dto.defaultBehavior.character,
				text: dto.defaultBehavior.text,
				nextBeat: dto.defaultBehavior.nextBeat,
				sceneData: this.#setSceneData(dto.defaultBehavior),
			},
			...this.#setSharedParams(dto),
		};
		return new MultiResponseBeat(params);
	}

	#createFinalBeat (dto: FinalBeatDto): FinalBeat {
		const params: FinalBeatParams = {
			defaultBehavior: {
				character: dto.defaultBehavior.character,
				text: dto.defaultBehavior.text,
				sceneData: this.#setSceneData(dto.defaultBehavior),
			},
			...this.#setSharedParams(dto),
		};
		return new FinalBeat(params);
	}

	// Type Checkers
	#isSimpleBeat (dto: BeatDto): dto is SimpleBeatDto {
		if (dto.choices || dto.responses || dto.branches || dto.crossBranchCondition) {
			return false;
		}

		if (!dto.defaultBehavior) {
			return false;
		}

		this.#validateDisplaySideEffects(dto.key, dto.defaultBehavior);

		return !!(dto.defaultBehavior.text && dto.defaultBehavior.nextBeat);
	}

	#isChoiceBeat (dto: BeatDto): dto is ChoiceBeatDto {
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

	#isFirstFitBranchBeat (dto: BeatDto): dto is FirstFitBranchBeatDto {
		if (dto.responses || !dto.branches || dto.choices || !dto.defaultBehavior || dto.crossBranchCondition) {
			return false;
		}

		for (const branch of dto.branches) {
			if (!branch.text || !branch.nextBeat || !branch.conditions) {
				return false;
			}
			this.#validateDisplaySideEffects(dto.key, dto.defaultBehavior);
		}

		if (dto.defaultBehavior) {
			this.#validateDisplaySideEffects(dto.key, dto.defaultBehavior);
			return !!(dto.defaultBehavior.text && dto.defaultBehavior.nextBeat);
		}

		return true;
	}

	#isBestFitBranchBeat (dto: BeatDto): dto is BestFitBranchBeatDto {
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

	#isMultiResponseBeat (dto: BeatDto): dto is MultiResponseBeatDto {
		if (!dto.responses || dto.branches || dto.choices || !dto.defaultBehavior || dto.crossBranchCondition) {
			return false;
		}

		for (const response of dto.responses) {
			if (!response.text) {
				return false;
			}
			this.#validateDisplaySideEffects(dto.key, dto.defaultBehavior);
		}

		this.#validateDisplaySideEffects(dto.key, dto.defaultBehavior);
		return !!(dto.defaultBehavior.text && dto.defaultBehavior.nextBeat);
	}

	#isFinalBeat (dto: BeatDto): dto is FinalBeatDto {
		if (dto.choices || dto.responses || dto.branches || dto.crossBranchCondition) {
			return false;
		}

		if (!dto.defaultBehavior) {
			return false;
		}

		this.#validateDisplaySideEffects(dto.key, dto.defaultBehavior);

		return !!(dto.defaultBehavior.text && !dto.defaultBehavior.nextBeat);
	}

	/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
	#validateDisplaySideEffects (key: string, data: any): boolean {
		const check: DisplaySideEffectsDto = data.sceneData;
		if (!check) {
			return true;
		}


		const errorMessage = `Received malformed display side effect data for ${key}.  See the documentation for expected shapes for side effects.`;

		if (Object.hasOwn(check, 'setBackground')) {
			if (!check.setBackground) {
				throw new Error(errorMessage);
			}
		}

		if (Object.hasOwn(check, 'updateCharacterSprites')) {
			check.updateCharacterSprites!.forEach((x) => {
				if (!x.character || !x.sprite) {
					throw new Error(errorMessage);
				}
			});
		}

		if (Object.hasOwn(check, 'moveCharacters')) {
			check.moveCharacters!.forEach((x) => {
				if (!x.character || !_isInt(x.newPosition)) {
					throw new Error(errorMessage);
				}
			});
		}

		if (Object.hasOwn(check, 'removeCharacters')) {
			check.removeCharacters!.forEach((x) => {
				if (!x.character) {
					throw new Error(errorMessage);
				}
			});
		}

		if (Object.hasOwn(check, 'addCharacters')) {
			check.addCharacters!.forEach((x) => {
				if (!x.character || !x.sprite || !_isInt(x.position)) {
					throw new Error(errorMessage);
				}
			});
		}
		return true;

		function _isInt (data: number): boolean {
			if (!data && data !== 0) {
				return false;
			}

			return data % 1 === 0;
		}
	}


	// Create Shared Data
	#createSingleCondition (conditions: SingleCriterionDto[]) {
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

	#createCrossCondition (condition: CrossConditionDto) {
		switch (condition.type) {
		case CrossConditionType.GREATEST_SENTIMENT: {
			return (params: CrossConditionParams): string => {
				const { characters } = params;
				let maxChar = characters[0];
				characters.forEach((char) => {
					const current = char.traits[condition.trait] || 0;
					const prior = maxChar.traits[condition.trait] || 0;
					if (current > prior) {
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
					const current = char.traits[condition.trait] || 0;
					const prior = minChar.traits[condition.trait] || 0;
					if (current < prior) {
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
			saveData: {
				queuedScenes: dto.saveData?.queuedScenes || [],
				unlockedChapters: dto.saveData?.unlockedChapters || [],
				unlockedAchievements: dto.saveData?.unlockedAchievements || [],
				addedItems: dto.saveData?.addedItems || [],
				removedItems: dto.saveData?.removedItems || [],
				addedMemories: dto.saveData?.addedMemories || [],
				removedMemories: dto.saveData?.removedMemories || [],
				updatedCharacterTraits: dto.saveData?.updatedCharacterTraits || [],
			},
		};
	}

	/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
	#setSceneData (data: any): DisplaySideEffects {
		return {
			setBackground: data?.sceneData?.setBackground || '',
			updateCharacterSprites: data?.sceneData?.updateCharacterSprites || [],
			moveCharacters: data?.sceneData?.moveCharacters || [],
			removeCharacters: data?.sceneData?.removeCharacters || [],
			addCharacters: data?.sceneData?.addCharacters || [],
		};
	}
}
