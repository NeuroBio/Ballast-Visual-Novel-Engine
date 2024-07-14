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

	play (): FinalBeatDisplay {
		return { text: `${this.speaker}: ${this.#text}` };
	}
}
