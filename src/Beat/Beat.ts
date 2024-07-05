import { Character } from '../Character/Character';
export const NARRATOR = 'Narrator';

interface BeatParams {
	character?: Character;
	text: string;
	beats?: Beat[];
}

export class Beat {
	text: string;
	speaker: string;
	nextBeat?: Beat;

	constructor (params: BeatParams) {
		const { character, text, beats } = params;
		this.text = text;
		this.speaker = character?.name || NARRATOR;

		if (beats) {
			this.nextBeat = beats[0];
		}
	}

	play (): string {
		return `${this.speaker}: ${this.text}`;
	}

	next (): Beat | void {
		return this.nextBeat;
	}
}
