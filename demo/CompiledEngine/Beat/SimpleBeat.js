import { Beat } from './Beat.js';
export class SimpleBeat extends Beat {
    #defaultBehavior;
    constructor(params) {
        const { defaultBehavior } = params;
        super(params);
        this.#defaultBehavior = defaultBehavior;
    }
    play(params) {
        const { characters } = params;
        return this.assembleStandardBeatDisplay({
            beat: this.#defaultBehavior,
            characters,
        });
    }
    nextBeats() {
        return [this.#defaultBehavior.nextBeat];
    }
}
