import { Beat, ChoiceBeatDisplay, PlayParams, StandardBeatDisplay } from './Beat';
import { DefaultBehavior } from './BeatFactory';

interface Choice {
	beat: StandardBeatDisplay;
	conditions: Array<(params: PlayParams) => boolean>;
}

interface ChoiceBeatParams {
	key: string;
	character?: string;
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

		const choicesHaveRequirements = choices.filter(x => x.conditions.length > 0);

		if (choicesHaveRequirements.length === choices.length && !defaultBehavior) {
			throw new Error('When all choices are conditional, a Default Behavior is required.');
		}
	}

	play (params: PlayParams): ChoiceBeatDisplay | StandardBeatDisplay {
		const choices: StandardBeatDisplay[] = [];
		this.#choices.forEach((choice) => {
			const includeChoice = this.#mayPlay(choice, params);
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

		const character = this.getCharacter({
			character: this.#defaultBehavior!.character,
			characters: params.characters,
		});
		return {
			text: `${character}: ${this.#defaultBehavior!.text}`,
			nextBeat: this.#defaultBehavior!.nextBeat!,
		};
	}

	#mayPlay (choice: Choice, params: PlayParams): boolean {
		if (choice.conditions.length === 0) {
			return true;
		}

		return choice.conditions.every((condition) => condition(params));
	}
}