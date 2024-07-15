import { Character } from '../Character/Character';
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

	play (characters: { [characterKey: string]: Character }): StandardBeatDisplay {
		const speaker = characters[this.character]?.name || this.character;
		return {
			text: `${speaker}: ${this.#text}`,
			nextBeat: this.#nextBeat,
		};
	}
}
