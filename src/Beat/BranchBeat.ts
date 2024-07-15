import { Beat, SimpleBeatDisplay } from './Beat';

interface BranchBeatParams {
	// choices: ChoiceOption[];
	character?: string;
}

export class BranchBeat extends Beat {
// 	#choices: ChoiceOption[];

	constructor (params: BranchBeatParams) {
		super(params);
	}

	play (): SimpleBeatDisplay {
		return { text: `not implemented`, nextBeat: '' };
	}
}
