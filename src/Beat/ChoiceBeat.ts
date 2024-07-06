import { Character } from '../Character/Character';
import { Beat, ChoiceBeatDisplay, SimpleBeatDisplay } from './Beat';

interface ChoiceOption {
	beat: SimpleBeatDisplay;
	allow?: (character: Character) => boolean;
}

interface ChoiceBeatParams {
	character?: Character;
	choices: ChoiceOption[];
	defaultBehavior?: SimpleBeatDisplay;
}

export class ChoiceBeat extends Beat {
	#choices: ChoiceOption[];
	#defaultBehavior?: SimpleBeatDisplay;

	constructor (params: ChoiceBeatParams) {
		const { choices, defaultBehavior } = params;
		super(params);
		this.#choices = choices;
		this.#defaultBehavior = defaultBehavior;


		if (choices.length === 1) {
			throw new Error('When there is only one choice, data should be formatted as a simple beat, not a choice beat.');
		}

		const choicesHaveRequirements = choices.filter(x => x.allow);
		if (choicesHaveRequirements.length > 0 && !this.character) {
			throw new Error('Cannot check for allowed choices without a Character.');
		}

		if (choicesHaveRequirements.length === choices.length && !defaultBehavior) {
			throw new Error('When all choices are optional, a Default Behavior is required.');
		}
	}

	play (): ChoiceBeatDisplay | SimpleBeatDisplay {
		const choices: SimpleBeatDisplay[] = [];
		this.#choices.forEach((choice) => {
			const includeChoice = choice.allow ? choice.allow(this.character!) : true;
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