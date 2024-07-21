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
		return this.assembleStandardBeatDisplay({
			text: this.#text,
			characters,
			character: this.#character,
			nextBeat: this.#nextBeat,
		});
	}
}
