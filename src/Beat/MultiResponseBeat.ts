import { Beat, PlayParams, StandardBeatDisplay } from './Beat';


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

		const nextResponse = this.#playableOptions[this.#lastPlayed];
		this.#lastPlayed += 1;
		if (nextResponse) {
			const character = this.getCharacter({
				character: nextResponse.beat.character,
				characters,
			});
			return {
				text: `${character}: ${nextResponse.beat.text}`,
				nextBeat: nextResponse.beat.nextBeat || this.#getFallback(),
			};
		}

		const character = this.getCharacter({
			character: this.#defaultBehavior.character,
			characters,
		});
		return {
			text: `${character}: ${this.#defaultBehavior.text}`,
			nextBeat: this.#defaultBehavior.nextBeat,
		};
	}

	#getFallback (): string {
		if (this.#lastPlayed === this.#playableOptions.length) {
			return this.#defaultBehavior.nextBeat;
		}

		return this.key;
	}
}
