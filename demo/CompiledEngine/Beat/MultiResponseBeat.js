import { Beat } from './Beat.js';
export class MultiResponseBeat extends Beat {
    #responses;
    #defaultBehavior;
    #playableOptions;
    #lastPlayed;
    constructor(params) {
        const { responses, defaultBehavior } = params;
        super(params);
        this.#responses = responses;
        this.#defaultBehavior = defaultBehavior;
        this.#playableOptions = [];
        if (responses.length < 2) {
            throw new Error('Multi Response Beats require at least 2 responses.  Use a Simple Beat or First Fit Branch Beat Instead.');
        }
    }
    play(params) {
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
    nextBeats() {
        const nextBeat = [];
        if (this.#defaultBehavior) {
            nextBeat.push(this.#defaultBehavior.nextBeat);
        }
        this.#responses.forEach((r) => {
            const next = r.beat.nextBeat;
            if (next) {
                nextBeat.push(next);
            }
        });
        return nextBeat;
    }
    #getFallback() {
        if (this.#lastPlayed === this.#playableOptions.length) {
            return this.#defaultBehavior.nextBeat;
        }
        return this.key;
    }
}
