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
	#currentBeatKey: string;
	#currentBeat: Beat;
	#name: string;
	#key: string;
	constructor (params: SceneParams) {
		const { beats, firstBeatKey, name, key } = params;

		this.#key = key;
		this.#name = name;
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
		this.#currentBeat = this.#beats[this.#firstBeatKey];
		return this.#currentBeat;
	}

	next (beatKey: string): Beat {
		this.#currentBeatKey = beatKey;
		this.#currentBeat = this.#beats[this.#currentBeatKey];
		return this.#currentBeat;
	}

	// restart() {}
}