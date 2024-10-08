import { FinalBeat } from '../Beat/FinalBeat.js';
export class Scene {
    #beats;
    #firstBeatKey;
    #priorBeatKey;
    #currentBeatKey;
    #currentBeat;
    #key;
    constructor(params) {
        const { beats, firstBeatKey, key } = params;
        this.#key = key;
        this.#beats = beats;
        this.#firstBeatKey = firstBeatKey;
        this.#currentBeatKey = firstBeatKey;
    }
    get key() {
        return this.#key;
    }
    get isComplete() {
        return this.#currentBeat instanceof FinalBeat;
    }
    start() {
        this.#currentBeatKey = this.#firstBeatKey;
        return this.#getCurrentBeatToPlay();
    }
    next(beatKey) {
        this.#priorBeatKey = this.#currentBeatKey;
        this.#currentBeatKey = beatKey;
        return this.#getCurrentBeatToPlay();
    }
    hasBeatReference() {
        if (this.#currentBeat) {
            return true;
        }
        return this.#isReferenced();
    }
    rollBack() {
        if (this.#priorBeatKey) {
            this.#currentBeatKey = this.#priorBeatKey;
            this.#currentBeat = this.#beats[this.#currentBeatKey];
        }
    }
    #getCurrentBeatToPlay() {
        this.#currentBeat = this.#beats[this.#currentBeatKey];
        return this.#currentBeat;
    }
    #isReferenced() {
        const knownBeats = new Set();
        Object.values(this.#beats).forEach(beat => beat.nextBeats().forEach((b) => knownBeats.add(b)));
        return knownBeats.has((this.#currentBeatKey));
    }
}
