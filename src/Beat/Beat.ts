import { Character } from '../Character/Character';
export const NARRATOR = 'Narrator';

export interface BeatParams {
	character?: Character;
}

export interface SimpleBeatDisplay {
	text: string;
	nextBeat: string;
}

export interface ChoiceBeatDisplay {
	choices: SimpleBeatDisplay[];
}

export interface FinalBeatDisplay {
	text: string;
}


export abstract class Beat {
	protected speaker: string;
	protected character?: Character;

	constructor (params: BeatParams) {
		const { character } = params;
		this.character = character;
		this.speaker = character?.name || NARRATOR;
	}

	abstract play (): SimpleBeatDisplay | ChoiceBeatDisplay | FinalBeatDisplay;
}