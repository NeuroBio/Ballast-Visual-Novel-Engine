import { Beat, StandardBeatDisplay } from './Beat';

interface BranchBeatParams {
	// choices: ChoiceOption[];
	character?: string;
}

export class BranchBeat extends Beat {
// 	#choices: ChoiceOption[];

	constructor (params: BranchBeatParams) {
		super(params);
	}

	play (): StandardBeatDisplay {
		return { text: `not implemented`, nextBeat: '' };
	}
}
