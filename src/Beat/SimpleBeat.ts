import { Beat, PlayParams, StandardBeatDisplay } from './Beat';
import { SharedBeatParams } from './BeatFactory';

interface SimpleBeatParams extends SharedBeatParams {
	character?: string;
	text: string;
	nextBeat: string;
}

export class SimpleBeat extends Beat {
	#text: string;
	#nextBeat: string;
	#character: string | undefined;

	constructor (params: SimpleBeatParams) {
		const { text, nextBeat, character } = params;
		super(params);

		this.#text = text;
		this.#nextBeat = nextBeat;
		this.#character = character;
	}

	play (params: PlayParams): StandardBeatDisplay {
		const { characters } = params;
		const character = this.getCharacter({
			character: this.#character,
			characters,
		});
		return {
			text: `${character}: ${this.#text}`,
			nextBeat: this.#nextBeat,
		};
	}
}
