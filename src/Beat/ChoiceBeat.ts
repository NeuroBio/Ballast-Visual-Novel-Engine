import { Beat, ChoiceBeatDisplay, PlayParams, StandardBeatDisplay } from './Beat';

interface ChoiceOption {
	beat: StandardBeatDisplay;
	conditions?: Array<(params: PlayParams) => boolean>;
}

interface ChoiceBeatParams {
	character?: string;
	choices: ChoiceOption[];
	defaultBehavior?: StandardBeatDisplay;
}

export class ChoiceBeat extends Beat {
	// #character?: string;
	#choices: ChoiceOption[];
	#defaultBehavior?: StandardBeatDisplay;

	constructor (params: ChoiceBeatParams) {
		const { choices, defaultBehavior } = params;
		super(params);
		this.#choices = choices;
		this.#defaultBehavior = defaultBehavior;


		if (choices.length === 1) {
			throw new Error('When there is only one choice, data should be formatted as a simple beat, not a choice beat.');
		}

		const choicesHaveRequirements = choices.filter(x => x.conditions);

		if (choicesHaveRequirements.length === choices.length && !defaultBehavior) {
			throw new Error('When all choices are conditional, a Default Behavior is required.');
		}
	}

	play (params: PlayParams): ChoiceBeatDisplay | StandardBeatDisplay {
		const choices: StandardBeatDisplay[] = [];
		this.#choices.forEach((choice) => {
			const includeChoice = choice.conditions ? choice.conditions[0](params) : true;
			if (includeChoice) {
				choices.push(choice.beat);
			}
		});

		if (choices.length > 1) {
			return { choices };
		}

		if (choices.length === 1) {
			return choices[0];
		}

		return this.#defaultBehavior!;
	}
}