import { Beat, FinalBeatDisplay, PlayParams } from './Beat';
import { SharedBeatParams } from './BeatFactory';

interface FinalBeatParams extends SharedBeatParams {
	character?: string;
	text: string;
}

export class FinalBeat extends Beat {
	#text: string;
	#character: string |undefined;

	constructor (params: FinalBeatParams) {
		const { text, character } = params;
		super(params);

		this.#text = text;
		this.#character = character;
	}

	play (params: PlayParams): FinalBeatDisplay {
		const { characters } = params;
		const character = this.getCharacter({
			character: this.#character,
			characters,
		});
		return { text: `${character}: ${this.#text}` };
	}
}
