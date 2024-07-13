import { Character } from '../Character/Character';
import { Beat, SimpleBeatDisplay } from './Beat';
import { FinalBeat } from './FinalBeat';
import { ChoiceBeat } from './ChoiceBeat';
import { SimpleBeat } from './SimpleBeat';

interface ConditionalCriterion {
	characterTrait: string;
	traitThreshold: string;
}

interface Choice {
	text: string;
	condition?: ConditionalCriterion;
	nextBeat: string;
}

export interface BeatDto {
	key: string;
	characterKey?: string;
	choices?: Choice[];
	defaultBehavior?: SimpleBeatDisplay;
	text?: string;
	nextBeat?: string;
}

export class BeatFactory {
	fromDto (dto: BeatDto): Beat {
		if (dto.choices) {
			return this.#createChoiceBeat(dto);
		}

		if (dto.nextBeat) {
			return this.#createSimpleBeat(dto);
		}

		return this.#createFinalBeat(dto);
	}

	#createSimpleBeat (dto: BeatDto): SimpleBeat {
		const params = {
			character: this.#getCharacter(dto.characterKey),
			text: dto.text!,
			nextBeat: dto.nextBeat!,
		};
		return new SimpleBeat(params);
	}

	#createFinalBeat (dto: BeatDto): FinalBeat {
		const params = {
			character: this.#getCharacter(dto.characterKey),
			text: dto.text!,
		};
		return new FinalBeat(params);
	}

	#createChoiceBeat (dto: BeatDto): ChoiceBeat {
		const params = {
			character: this.#getCharacter(dto.characterKey),
			choices: dto.choices!.map((choice) => ({
				beat: { text: choice.text, nextBeat: choice.nextBeat },
				condition: this.#createConditional(choice.condition),
			})),
			defaultBehavior: dto.defaultBehavior,
		};
		return new ChoiceBeat(params);
	}

	#getCharacter (characterKey?: string): Character | undefined {
		return characterKey ? new Character({ name: characterKey, key: characterKey, memories: [], sentiments: {} }) : undefined;
	}

	#createConditional (condition?: ConditionalCriterion) {
		if (!condition) {
			return;
		}

		const { characterTrait, traitThreshold } = condition;
		return (character: Character) => character[characterTrait as keyof Character] >= traitThreshold;
	}
}