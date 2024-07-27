import { Beat, ChoiceBeatDisplay, PlayParams } from './Beat';
import { DefaultBehaviorStandard, SaveDataSideEffects } from './SharedInterfaces';

interface Choice {
	beat: {
		text: string;
		nextBeat: string;
		mayPlay: boolean;
	};
	conditions: Array<(params: PlayParams) => boolean>;
}

export interface ChoiceBeatParams {
	key: string;
	choices: Choice[];
	defaultBehavior?: DefaultBehaviorStandard;
	saveData: SaveDataSideEffects;
}

export class ChoiceBeat extends Beat {
	#choices: Choice[];
	#defaultBehavior?: DefaultBehaviorStandard;

	constructor (params: ChoiceBeatParams) {
		const { choices, defaultBehavior } = params;
		super(params);
		this.#choices = choices;
		this.#defaultBehavior = defaultBehavior;


		if (choices.length < 2) {
			throw new Error('Choice beats require at least 2 choices.');
		}

		const choicesWithRequirements = choices.filter(x => x.conditions.length > 0);

		if (choicesWithRequirements.length === choices.length && !defaultBehavior) {
			throw new Error('When all choices are conditional, a Default Behavior is required.');
		}
	}

	play (params: PlayParams): ChoiceBeatDisplay {
		const { characters } = params;
		let playableChoices = 0;
		this.#choices.forEach((choice) => {
			choice.beat.mayPlay = this.#mayPlay(choice, params);
			if (choice.beat.mayPlay) {
				playableChoices += 1;
			}
		});

		const result: ChoiceBeatDisplay = {
			choices: this.#choices.map(x => x.beat),
			saveData: this.createSaveDataSideEffects(),
		};

		if (playableChoices > 0) {
			return result;
		}

		result.default = this.assembleStandardBeatDisplay({ beat: this.#defaultBehavior!, characters });
		return result;
	}

	nextBeats (): string[] {
		const nextBeat: string[] = [];
		if (this.#defaultBehavior) {
			nextBeat.push(this.#defaultBehavior.nextBeat);
		}
		nextBeat.push(...this.#choices.map((c) => c.beat.nextBeat));
		return nextBeat;
	}

	#mayPlay (choice: Choice, params: PlayParams): boolean {
		if (choice.conditions.length === 0) {
			return true;
		}

		return choice.conditions.every((condition) => condition(params));
	}
}