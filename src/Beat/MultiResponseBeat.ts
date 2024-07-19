import { Beat, FinalBeatDisplay, PlayParams, StandardBeatDisplay } from './Beat';
import { DefaultBehavior } from './BeatFactory';

interface Response {
	beat: StandardBeatDisplay | FinalBeatDisplay;
	conditions: Array<(params: PlayParams) => boolean>;
}

interface MultiResponseBeatParams {
	key: string;
	responses: Response[];
	defaultBehavior: DefaultBehavior;
}

export class MultiResponseBeat extends Beat {
	#responses: Response[];
	#defaultBehavior: DefaultBehavior;
	#playableOptions: Response[];
	#lastPlayed: number;

	constructor (params: MultiResponseBeatParams) {
		const { responses, defaultBehavior } = params;
		super(params);
		this.#responses = responses;
		this.#defaultBehavior = defaultBehavior;

		if (responses.length < 2) {
			throw new Error('Multi Response Beats require at least 2 responses.');
		}
	}

	play (params: PlayParams): StandardBeatDisplay {
		// if !lastPlayed, assemble playableOptions
		// 		no playable options, play default
		// 		some, set playNext to 0
		// assemble next beat (nextBeat = self (not last beat) OR defaultBehavior.nextBeat (last beat))
		// return response

		return { text: '', nextBeat: '' };
	}
}
