import { Beat, StandardBeatDisplay } from './Beat';

interface SimpleBeatParams {
	character?: string;
	text: string;
	nextBeat: string;
}

export class SimpleBeat extends Beat {
	#text: string;
	#nextBeat: string;

	constructor (params: SimpleBeatParams) {
		const { text, nextBeat } = params;
		super(params);

		this.#text = text;
		this.#nextBeat = nextBeat;
	}

	play (): StandardBeatDisplay {
		return {
			text: `${this.speaker}: ${this.#text}`,
			nextBeat: this.#nextBeat,
		};
	}
}
