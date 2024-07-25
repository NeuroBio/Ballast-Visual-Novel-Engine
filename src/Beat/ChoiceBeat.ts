import { Beat, ChoiceBeatDisplay, PlayParams, StandardBeatDisplay } from './Beat';
import { SharedBeatParams } from './BeatFactory';

interface DefaultBehavior {
	text: string;
	character?: string;
	nextBeat: string;
}

interface Choice {
	beat: DefaultBehavior;
	conditions: Array<(params: PlayParams) => boolean>;
}

interface ChoiceBeatParams extends SharedBeatParams {
	choices: Choice[];
	defaultBehavior?: DefaultBehavior;
}

export class ChoiceBeat extends Beat {
	#choices: Choice[];
	#defaultBehavior?: DefaultBehavior;

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

	play (params: PlayParams): ChoiceBeatDisplay | StandardBeatDisplay {
		const { characters } = params;
		const choices: DefaultBehavior[] = [];
		this.#choices.forEach((choice) => {
			const includeChoice = this.#mayPlay(choice, params);
			if (includeChoice) {
				choices.push(choice.beat);
			}
		});

		if (choices.length > 1) {
			return { choices, saveData: this.createSaveDataSideEffects() };
		}

		const beat = (choices.length === 1)
			? { ...choices[0], saveData: this.createSaveDataSideEffects() }
			: this.#defaultBehavior!;

		return this.assembleStandardBeatDisplay({ beat, characters });
	}

	#mayPlay (choice: Choice, params: PlayParams): boolean {
		if (choice.conditions.length === 0) {
			return true;
		}

		return choice.conditions.every((condition) => condition(params));
	}
}