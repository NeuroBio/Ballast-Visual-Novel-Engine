import { Beat, PlayParams, StandardBeatDisplay } from './Beat';
import { DefaultBehavior } from './BeatFactory';

interface Branch {
	beat: StandardBeatDisplay;
	conditions: Array<(params: PlayParams) => boolean>;
}

interface FirstFitBranchBeatParams {
	key: string;
	branches: Branch[];
	defaultBehavior: DefaultBehavior;
}

export class FirstFitBranchBeat extends Beat {
	#branches: Branch[];
	#defaultBehavior: DefaultBehavior;

	constructor (params: FirstFitBranchBeatParams) {
		const { defaultBehavior, branches } = params;
		super(params);

		this.#defaultBehavior = defaultBehavior;
		this.#branches = branches;

		if (branches.length < 2) {
			throw new Error('Branch Beats require at least 2 branches.');
		}

		const branchesHaveRequirements = branches.filter(x => x.conditions.length > 0);
		if (branchesHaveRequirements.length === 0) {
			throw new Error('When no branches are conditional, data should be formatted as a Simple Beat, not a Branch Beat.');
		}

		if (branchesHaveRequirements.length !== branches.length) {
			throw new Error('All branches in a First Fit Branch Beat should be conditional.');
		}
	}

	play (params: PlayParams): StandardBeatDisplay {
		const { characters } = params;


		const character = this.getCharacter({
			character: this.#defaultBehavior!.character,
			characters,
		});
		return {
			text: `${character}: ${this.#defaultBehavior!.text}`,
			nextBeat: this.#defaultBehavior!.nextBeat!,
		};
	}
}
