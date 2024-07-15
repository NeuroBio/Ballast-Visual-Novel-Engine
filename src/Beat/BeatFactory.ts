import { Beat, StandardBeatDisplay } from './Beat';
import { FinalBeat } from './FinalBeat';
import { ChoiceBeat } from './ChoiceBeat';
import { SimpleBeat } from './SimpleBeat';
import { Character } from '../Character/Character';
import { InventoryItemParams, MemoryParams, SceneParams, SentimentParams } from '../SavedData/SavedData';

interface ConditionalCriterion {
	characterTrait: string;
	traitThreshold: string;
}

interface Choice {
	text: string;
	condition?: ConditionalCriterion;
	nextBeat: string;
}

export interface SharedBeatParams {
	queuedScenes?: SceneParams[];
	unlockedChapters?: string[];
	unlockedAchievements?: string[];
	addedItems?: InventoryItemParams[];
	removedItems?: InventoryItemParams[];
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
			choices: dto.choices!.map((choice) => ({
				beat: { text: choice.text, nextBeat: choice.nextBeat },
				condition: this.#createConditional(choice.condition),
			})),
			defaultBehavior: dto.defaultBehavior,
			...this.#setSharedParams(dto),
		};
		return new ChoiceBeat(params);
	}

	#createConditional (condition?: ConditionalCriterion) {
		if (!condition) {
			return;
		}

		const { characterTrait, traitThreshold } = condition;
		return (character: Character) => character[characterTrait as keyof Character] >= traitThreshold;
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