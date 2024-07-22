import { Beat, PlayParams, StandardBeatDisplay } from './Beat';
import { SharedBeatParams } from './BeatFactory';


interface DefaultBehavior {
	text: string;
	character?: string;
	nextBeat: string;
}

interface ResponseBehavior {
	text: string;
	character?: string;
	nextBeat?: string;
}

interface Response {
	beat: ResponseBehavior;
	conditions: Array<(params: PlayParams) => boolean>;
}

interface MultiResponseBeatParams extends SharedBeatParams {
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
		this.#playableOptions = [];

		if (responses.length < 2) {
			throw new Error('Multi Response Beats require at least 2 responses.  Use a Simple Beat or First Fit Branch Beat Instead.');
		}
	}

	play (params: PlayParams): StandardBeatDisplay {
		const { characters } = params;

		if (!this.#lastPlayed) {
			this.#lastPlayed = 0;

			this.#responses.forEach((response) => {
				if (response.conditions.every((condition) => condition(params))) {
					this.#playableOptions.push(response);
				}
			});
		}

		let beat;
		const nextResponse = this.#playableOptions[this.#lastPlayed];
		this.#lastPlayed += 1;
		if (nextResponse) {
			beat = {
				text: nextResponse.beat.text,
				character: nextResponse.beat.character,
				nextBeat: nextResponse.beat.nextBeat || this.#getFallback(),
			};
		}

		beat ??= this.#defaultBehavior;

		return this.assembleStandardBeatDisplay({ beat, characters });
	}

	#getFallback (): string {
		if (this.#lastPlayed === this.#playableOptions.length) {
			return this.#defaultBehavior.nextBeat;
		}

		return this.key;
	}
}
