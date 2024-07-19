import { PlayParams, StandardBeatDisplay } from './Beat';
import { DefaultBehavior } from './BeatFactory';

interface Response {
	beat: StandardBeatDisplay;
	conditions: Array<(params: PlayParams) => boolean>;
}

interface MultiResponseBeatParams {
	responses: Response[];
	defaultBehavior: DefaultBehavior;
}

export class MultiResponseBeat {
	#responses: Response[];
	#defaultBehavior: DefaultBehavior;
	#playableOptions: Response[];
	#playNext: number;

	constructor (params: MultiResponseBeatParams) {
		const { responses, defaultBehavior } = params;
		this.#responses = responses;
		this.#defaultBehavior = defaultBehavior;

		// invalid if less than 2 responses
	}

	play (params: PlayParams) {
		// if !lastplayed, assemble playableOptions
		// 		no playable options, play default
		// 		some, set playNext to 0
		// assemble next beat (nextBeat = self (not last beat) OR defaultBehavior.nextBeat (last beat))
		// return response
	}
}