import { Character } from '../Character/Character';
import { Beat, FinalBeatDisplay } from './Beat';

interface FinalBeatParams {
	character?: string;
	text: string;
}

export class FinalBeat extends Beat {
	#text: string;

	constructor (params: FinalBeatParams) {
		const { text } = params;
		super(params);

		this.#text = text;
	}

	play (characters: { [characterKey: string]: Character }): FinalBeatDisplay {
		const speaker = characters[this.character]?.name || this.character;
		return { text: `${speaker}: ${this.#text}` };
	}
}
