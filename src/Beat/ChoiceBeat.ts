import { Beat, ChoiceBeatDisplay, PlayParams, StandardBeatDisplay } from './Beat';
import { SharedBeatParams } from './BeatFactory';

interface DefaultBehavior {
	text: string;
	character?: string;
	nextBeat: string;
}

interface ChoiceBehavior extends DefaultBehavior {
	mayPlay: boolean;
}

interface Choice {
	beat: ChoiceBehavior;
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
		let playableChoices = 0;
		this.#choices.forEach((choice) => {
			choice.beat.mayPlay = this.#mayPlay(choice, params);
			if (choice.beat.mayPlay) {
				playableChoices += 1;
			}
		});

		if (playableChoices > 0) {
			return {
				choices: this.#choices.map(x => x.beat),
				saveData: this.createSaveDataSideEffects(),
			};
		}

		return this.assembleStandardBeatDisplay({ beat: this.#defaultBehavior!, characters });
	}

	#mayPlay (choice: Choice, params: PlayParams): boolean {
		if (choice.conditions.length === 0) {
			return true;
		}

		return choice.conditions.every((condition) => condition(params));
	}
}