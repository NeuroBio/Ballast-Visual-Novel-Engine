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
}

interface Branch {
	text: string;
	character?: string,
	nextBeat: string;
	conditions?: SingleCriterion[];
}

interface BestFitBranch {
	text: string;
	character: string,
	nextBeat: string;
	conditions?: SingleCriterion[];
}

interface Response {
	text: string,
	character?: string,
	nextBeat?: string;
	conditions?: SingleCriterion[];
}

export interface DefaultBehavior {
	text: string;
	character?: string;
	nextBeat?: string;
}

interface SceneUpdates {
	updateCharacterSprite: { character: string, sprite: string }[];
	moveCharacter: { character: string, newPosition: number }[];
	removeCharacter: { character: string }[];
	addCharacter: { character: string, position: number, sprite: string }[];
	setBackground: string;
}
export interface SharedBeatParams {
	key: string;
	queuedScenes?: SceneParams[];
	unlockedChapters?: string[];
	unlockedAchievements?: string[];
	addedItems?: InventoryItem[];
	removedItems?: InventoryItem[];
	addedMemories?: MemoryParams[];
	removedMemories?: MemoryParams[];
	updatedCharacterTraits?: TraitParams[];
}

export interface BeatDto extends SharedBeatParams {
	defaultBehavior?: DefaultBehavior;
	choices?: Choice[];
	branches?: Branch[],
	crossBranchCondition?: TraitMaxMinCondition;
	responses?: Response[]
}

interface SimpleBeatParams extends SharedBeatParams {
	defaultBehavior: { nextBeat: string, text: string, character?: string };
}

interface FinalBeatParams extends SharedBeatParams {
	defaultBehavior: { text: string, character?: string };
}

interface ChoiceBeatParams extends SharedBeatParams {
	choices: Choice[];
	defaultBehavior?: { text: string, character?: string, nextBeat: string };
}

interface FirstFitBranchBeatParams extends SharedBeatParams {
	branches: BestFitBranch[];
	defaultBehavior: { text: string, character?: string, nextBeat: string };
}

interface BestFitBranchBeatParams extends SharedBeatParams {
	branches: BestFitBranch[];
	crossBranchCondition: TraitMaxMinCondition;
	defaultBehavior?: { text: string, character?: string, nextBeat: string };
}

interface MultiResponseBeatParams extends SharedBeatParams {
	responses: Response[];
	defaultBehavior: { text: string, character?: string, nextBeat: string };
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
			queuedScenes: dto.queuedScenes,
			unlockedChapters: dto.unlockedChapters,
			unlockedAchievements: dto.unlockedAchievements,
			addedItems: dto.addedItems,
			removedItems: dto.removedItems,
			addedMemories: dto.addedMemories,
			removedMemories: dto.removedMemories,
			updatedCharacterTraits: dto.updatedCharacterTraits,
		};
	}

	#isSimpleBeat (dto: BeatDto): dto is SimpleBeatParams {
		if (dto.choices || dto.responses || dto.branches || dto.crossBranchCondition) {
			return false;
		}

		if (!dto.defaultBehavior) {
			return false;
		}

		return !!(dto.defaultBehavior.text && dto.defaultBehavior.nextBeat);
	}

	#isFinalBeat (dto: BeatDto): dto is FinalBeatParams {
		if (dto.choices || dto.responses || dto.branches || dto.crossBranchCondition) {
			return false;
		}

		if (!dto.defaultBehavior) {
			return false;
		}

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
		}

		if (dto.defaultBehavior) {
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
		}

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
}
