import { Beat, FinalBeatDisplay, PlayParams } from './Beat';

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

	play (params: PlayParams): FinalBeatDisplay {
		const { characters } = params;
		const speaker = characters[this.character]?.name || this.character;
		return { text: `${speaker}: ${this.#text}` };
	}
}
