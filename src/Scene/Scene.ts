import { Beat } from '../Beat/Beat';
import { FinalBeat } from '../Beat/FinalBeat';

interface SceneParams {
	beats: { [key: string]: Beat};
	firstBeatKey: string;
	name: string;
	key: string;
}

export class Scene {
	#beats: { [key: string]: Beat};
	#firstBeatKey: string;
	#priorBeatKey: string;
	#currentBeatKey: string;
	#currentBeat: Beat;
	#key: string;
	constructor (params: SceneParams) {
		const { beats, firstBeatKey, key } = params;

		this.#key = key;
		this.#beats = beats;
		this.#firstBeatKey = firstBeatKey;
		this.#currentBeatKey = firstBeatKey;
	}

	get key (): string {
		return this.#key;
	}

	get isComplete (): boolean {
		return this.#currentBeat instanceof FinalBeat;
	}


	start (): Beat {
		this.#currentBeatKey = this.#firstBeatKey;
		return this.#getCurrentBeatToPlay();
	}

	next (beatKey: string): Beat {
		this.#priorBeatKey = this.#currentBeatKey;
		this.#currentBeatKey = beatKey;
		return this.#getCurrentBeatToPlay();
	}

	hasBeatReference (): boolean {
		if (this.#currentBeat) {
			return true;
		}

		return this.#isReferenced();
	}

	rollBack (): void {
		if (this.#priorBeatKey) {
			this.#currentBeatKey = this.#priorBeatKey;
			this.#currentBeat = this.#beats[this.#currentBeatKey];
		}
	}

	#getCurrentBeatToPlay () {
		this.#currentBeat = this.#beats[this.#currentBeatKey];
		return this.#currentBeat;
	}

	#isReferenced (): boolean {
		const knownBeats = new Set();
		Object.values(this.#beats).forEach(beat =>
			beat.nextBeats().forEach((b) => knownBeats.add(b)));

		return knownBeats.has((this.#currentBeatKey));
	}
}