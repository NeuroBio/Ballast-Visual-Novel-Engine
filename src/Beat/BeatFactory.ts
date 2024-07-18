import { Beat, PlayParams } from './Beat';
import { FinalBeat } from './FinalBeat';
import { ChoiceBeat } from './ChoiceBeat';
import { SimpleBeat } from './SimpleBeat';
import { InventoryItem, MemoryParams, SceneParams, SentimentParams } from '../SavedData/SavedData';
import { FirstFitBranchBeat } from './FirstFitBranchBeat';

export enum ConditionalType {
	GREATEST_SENTIMENT = 'charMost',
	LEAST_SENTIMENT = 'charLeast',
	AT_LEAST_ITEM = 'itemEqual+',
	AT_MOST_ITEM = 'itemEqual-',
	CHARACTER_AWARE = 'hasMemory',
	CHARACTER_UNAWARE = 'lacksMemory',
	AT_LEAST_CHAR_FEELS = 'charFeelsEqual+',
	AT_MOST_CHAR_FEELS = 'charFeelsEqual-',
}

interface ItemCondition {
	type: ConditionalType.AT_LEAST_ITEM | ConditionalType.AT_MOST_ITEM;
	item: string;
	quantity: number;
}

interface MemoryCondition {
	type: ConditionalType.CHARACTER_AWARE | ConditionalType.CHARACTER_UNAWARE;
	character: string;
	memory: string;
}

interface SentimentLimitCondition {
	type: ConditionalType.AT_LEAST_CHAR_FEELS | ConditionalType.AT_MOST_CHAR_FEELS;
	character: string;
	sentiment: string;
	value: number;
}

interface SentimentMaxMinCondition {
	type: ConditionalType.GREATEST_SENTIMENT | ConditionalType.LEAST_SENTIMENT;
	character: string;
	sentiment: string;
}

type ConditionCriterion = ItemCondition | MemoryCondition | SentimentLimitCondition |SentimentMaxMinCondition;

interface Choice {
	text: string;
	nextBeat: string;
	conditions?: ConditionCriterion[];
}

interface Branch {
	text: string;
	character?: string,
	nextBeat: string;
	conditions: ConditionCriterion[];
}

interface Response {
	text: string,
	character?: string,
	conditions?: ConditionCriterion[];
}

export interface DefaultBehavior {
	text: string;
	character?: string;
	nextBeat?: string;
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
	updatedCharacterSentiments?: SentimentParams[];
}

export interface BeatDto extends SharedBeatParams {
	defaultBehavior?: DefaultBehavior;
	choices?: Choice[];
	branches?: Branch[],
	responses?: Response[]
}

interface SimpleBeatParams extends SharedBeatParams {
	key: string;
	defaultBehavior: { nextBeat: string, text: string, character?: string };
}

interface FinalBeatParams extends SharedBeatParams {
	key: string;
	defaultBehavior: { text: string, character?: string };
}

interface ChoiceBeatParams extends SharedBeatParams {
	key: string;
	choices: Choice[];
	defaultBehavior?: { text: string, character?: string, nextBeat: string };
}

interface FirstFitBranchBeatParams extends SharedBeatParams {
	key: string;
	branches: Branch[];
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

		if (this.#isFinalBeat(dto)) {
			return this.#createFinalBeat(dto);
		}

		throw new Error(`Received malformed beat data for ${dto.key}.  See the documentation for expected shapes for different beat types.`);
	}

	#createSimpleBeat (dto: SimpleBeatParams): SimpleBeat {
		const params = {
			character: dto.defaultBehavior.character,
			text: dto.defaultBehavior.text,
			nextBeat: dto.defaultBehavior.nextBeat,
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
			character: dto.defaultBehavior?.character,
			choices: dto.choices.map((choice) => ({
				beat: { text: choice.text, nextBeat: choice.nextBeat },
				conditions: this.#createConditional(choice.conditions || []) || [],
			})),
			defaultBehavior: dto.defaultBehavior,
			...this.#setSharedParams(dto),
		};
		return new ChoiceBeat(params);
	}
	#createFirstFitBranchBeat (dto: FirstFitBranchBeatParams): FirstFitBranchBeat {
		const params = {
			character: dto.defaultBehavior.character,
			branches: dto.branches.map((branch) => ({
				beat: { text: branch.text, nextBeat: branch.nextBeat, character: branch.character },
				conditions: this.#createConditional(branch.conditions || []) || [],
			})),
			defaultBehavior: dto.defaultBehavior,
			...this.#setSharedParams(dto),
		};
		console.log(JSON.stringify(params, null, 2));
		return new FirstFitBranchBeat(params);
	}

	#createConditional (conditions: ConditionCriterion[]) {
		return conditions.map((condition) => {
			switch (condition.type) {
			case ConditionalType.AT_LEAST_ITEM: {
				const { item, quantity } = condition;
				return (params: PlayParams) =>
					(params.inventory[item] || 0) >= quantity;
			}

			case ConditionalType.AT_MOST_ITEM: {
				const { item, quantity } = condition;
				return (params: PlayParams) =>
					(params.inventory[item] || 0) <= quantity;
			}

			case ConditionalType.CHARACTER_AWARE: {
				const { character, memory } = condition;
				return (params: PlayParams) =>
					params.characters[character].hasMemory(memory);
			}

			case ConditionalType.CHARACTER_UNAWARE: {
				const { character, memory } = condition;
				return (params: PlayParams) =>
					!params.characters[character].hasMemory(memory);
			}

			case ConditionalType.AT_LEAST_CHAR_FEELS: {
				const { character, sentiment, value } = condition;
				return (params: PlayParams) =>
					params.characters[character].sentiments[sentiment] >= value;
			}

			case ConditionalType.AT_MOST_CHAR_FEELS: {
				const { character, sentiment, value } = condition;
				return (params: PlayParams) =>
					params.characters[character].sentiments[sentiment] <= value;
			}

			// case ConditionalType.GREATEST_SENTIMENT: {
			// 	return () => true;
			// }

			// case ConditionalType.LEAST_SENTIMENT: {
			// 	return () => true;
			// }

			default:
				throw new Error('Not a real condition');
			}
		});
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
			updatedCharacterSentiments: dto.updatedCharacterSentiments,
		};
	}

	#isSimpleBeat (dto: BeatDto): dto is SimpleBeatParams {
		if (dto.choices || dto.responses || dto.branches) {
			return false;
		}

		if (!dto.defaultBehavior) {
			return false;
		}

		return !!(dto.defaultBehavior.text && dto.defaultBehavior.nextBeat);
	}

	#isFinalBeat (dto: BeatDto): dto is FinalBeatParams {
		if (dto.choices || dto.responses || dto.branches) {
			return false;
		}

		if (!dto.defaultBehavior) {
			return false;
		}

		return !!(dto.defaultBehavior.text && !dto.defaultBehavior.nextBeat);
	}

	#isChoiceBeat (dto: BeatDto): dto is ChoiceBeatParams {
		if (dto.responses || dto.branches || !dto.choices) {
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
		if (dto.responses || !dto.branches || dto.choices || !dto.defaultBehavior) {
			return false;
		}

		for (const branch of dto.branches) {
			if (!branch.text || !branch.nextBeat || !branch.conditions) {
				return false;
			}
		}

		return !!(dto.defaultBehavior.text && dto.defaultBehavior.nextBeat);
	}

	// 	#isMultiResponseBeat (dto: BeatDto) {

// 	}
}