import { Beat, PlayParams, StandardBeatDisplay } from './Beat';
import { DefaultBehaviorStandard, DisplaySideEffects, SaveDataSideEffects } from './SharedInterfaces';

interface FirstFitBranch {
	beat: {
		text: string;
		character?: string,
		nextBeat: string;
		sceneData: DisplaySideEffects;
	}
	conditions: Array<(params: PlayParams) => boolean>;
}

export interface FirstFitBranchBeatParams {
	key: string;
	branches: FirstFitBranch[];
	defaultBehavior?: DefaultBehaviorStandard;
	saveData: SaveDataSideEffects;
}

export class FirstFitBranchBeat extends Beat {
	#branches: FirstFitBranch[];
	#defaultBehavior?: DefaultBehaviorStandard;

	constructor (params: FirstFitBranchBeatParams) {
		const { defaultBehavior, branches } = params;
		super(params);

		this.#defaultBehavior = defaultBehavior;
		this.#branches = branches;

		if (branches.length < 1) {
			throw new Error('Branch Beats require at least 1 branch.');
		}

		const branchesWithRequirements = branches.filter(x => x.conditions.length > 0);
		if (branchesWithRequirements.length !== branches.length) {
			throw new Error('All branches in a First Fit Branch Beat should be conditional.');
		}
	}

	play (params: PlayParams): StandardBeatDisplay {
		const { characters } = params;

		let beat;
		for (const branch of this.#branches) {
			if (branch.conditions.every((condition) => condition(params))) {
				beat = branch.beat;
				break;
			}
		}

		beat ??= this.#defaultBehavior!;

		return this.assembleStandardBeatDisplay({ beat, characters });
	}
}
