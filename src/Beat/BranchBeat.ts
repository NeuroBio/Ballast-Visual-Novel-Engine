import { Character } from '../Character/Character';
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

	play (characters: { [characterKey: string]: Character }): StandardBeatDisplay {
		const speaker = characters[this.character]?.name || this.character;
		return { text: `${speaker}`, nextBeat: '' };
	}
}
