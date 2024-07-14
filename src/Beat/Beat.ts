import { Character } from '../Character/Character';

export const NARRATOR = 'Narrator';

export interface BeatParams {
	character?: string;
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
	protected character: string;
	protected speaker: string;

	constructor (params: BeatParams) {
		const { character } = params;
		this.speaker = character || NARRATOR;
		this.character = character || NARRATOR;
	}

	abstract play (characters: { [characterKey: string]: Character }): SimpleBeatDisplay | ChoiceBeatDisplay | FinalBeatDisplay;
}