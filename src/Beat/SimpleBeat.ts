import { Character } from '../Character/Character';
import { Beat, SimpleBeatDisplay } from './Beat';

interface SimpleBeatParams {
	character?: Character;
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

	play (): SimpleBeatDisplay {
		return {
			text: `${this.speaker}: ${this.#text}`,
			nextBeat: this.#nextBeat,
		};
	}
}
