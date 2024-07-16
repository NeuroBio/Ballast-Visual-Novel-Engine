import { Beat, PlayParams, StandardBeatDisplay } from './Beat';
import { FinalBeat } from './FinalBeat';
import { ChoiceBeat } from './ChoiceBeat';
import { SimpleBeat } from './SimpleBeat';
import { InventoryItem, MemoryParams, SceneParams, SentimentParams } from '../SavedData/SavedData';

enum ConditionalType {
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
	condition?: ConditionCriterion;
	nextBeat: string;
}

export interface SharedBeatParams {
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
	key: string;
	character?: string;
	choices?: Choice[];
	userChoice?: boolean;
	defaultBehavior?: StandardBeatDisplay;
	text?: string;
	nextBeat?: string;
}


export class BeatFactory {
	fromDto (dto: BeatDto): Beat {
		if (dto.choices) {
			return this.#createChoiceBeat(dto); // add branch beat here on !userChoice
		}

		if (dto.nextBeat) {
			return this.#createSimpleBeat(dto);
		}

		return this.#createFinalBeat(dto);
	}

	#createSimpleBeat (dto: BeatDto): SimpleBeat {
		const params = {
			character: dto.character,
			text: dto.text!,
			nextBeat: dto.nextBeat!,
			...this.#setSharedParams(dto),
		};
		return new SimpleBeat(params);
	}

	#createFinalBeat (dto: BeatDto): FinalBeat {
		const params = {
			character: dto.character,
			text: dto.text!,
			...this.#setSharedParams(dto),
		};
		return new FinalBeat(params);
	}

	#createChoiceBeat (dto: BeatDto): ChoiceBeat {
		const params = {
			character: dto.character,
			choices: dto.choices!.map((choice) => {
				const condition = this.#createConditional(choice.condition);
				return {
					beat: { text: choice.text, nextBeat: choice.nextBeat },
					condition: condition ? [condition] : undefined,
				};
			}),
			defaultBehavior: dto.defaultBehavior,
			...this.#setSharedParams(dto),
		};
		return new ChoiceBeat(params);
	}

	#createConditional (condition?: ConditionCriterion) {
		if (!condition) {
			return undefined;
		}

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
	}

	#setSharedParams (dto: BeatDto): SharedBeatParams {
		return {
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
}