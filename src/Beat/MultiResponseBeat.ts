import { Beat, PlayParams, StandardBeatDisplay } from './Beat';
import { DefaultBehaviorStandard, DisplaySideEffects, SaveDataSideEffects } from './SharedInterfaces';

interface Response {
	beat: {
		text: string,
		character?: string,
		nextBeat?: string;
		sceneData: DisplaySideEffects;
	}
	conditions: Array<(params: PlayParams) => boolean>;
}

export interface MultiResponseBeatParams {
	key: string;
	responses: Response[];
	defaultBehavior: DefaultBehaviorStandard;
	saveData: SaveDataSideEffects;
}

export class MultiResponseBeat extends Beat {
	#responses: Response[];
	#defaultBehavior: DefaultBehaviorStandard;
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
				sceneData: nextResponse.beat.sceneData,
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
