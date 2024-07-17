import { Beat, PlayParams, StandardBeatDisplay } from './Beat';

interface BranchBeatParams {
	// choices: ChoiceOption[];
	key: string;
	character?: string;
}

export class BranchBeat extends Beat {
// 	#choices: ChoiceOption[];

	constructor (params: BranchBeatParams) {
		super(params);
	}

	play (params: PlayParams): StandardBeatDisplay {
		const { characters } = params;
		const speaker = characters[this.character]?.name || this.character;
		return { text: `${speaker}`, nextBeat: '' };
	}
}
