import { Beat, ChoiceBeatDisplay, FinalBeatDisplay, SimpleBeatDisplay } from '../Beat/Beat';
import { FinalBeat } from '../Beat/FinalBeat';

interface SceneParams {
	beats: { [key: string]: Beat};
	firstBeatKey: string;
	name: string;
	key: string;
	locked: boolean;
}

export class Scene {
	#beats: { [key: string]: Beat};
	#firstBeatKey: string;
	#currentBeatKey: string;
	#currentBeat: Beat;
	#name: string;
	#key: string;
	#locked: boolean;

	constructor (params: SceneParams) {
		const { beats, firstBeatKey, name, key, locked } = params;

		this.#key = key;
		this.#name = name;
		this.#beats = beats;
		this.#locked = locked;
		this.#firstBeatKey = firstBeatKey;
		this.#currentBeatKey = firstBeatKey;
	}

	get key (): string {
		return this.#key;
	}

	get isComplete (): boolean {
		return this.#currentBeat instanceof FinalBeat;
	}

	start (): SimpleBeatDisplay | ChoiceBeatDisplay | FinalBeatDisplay {
		this.#currentBeat = this.#beats[this.#currentBeatKey];
		return this.#currentBeat.play();
	}

	next (beatKey: string): Beat {
		this.#currentBeatKey = beatKey;
		this.#currentBeat = this.#beats[this.#currentBeatKey];
		return this.#currentBeat;
	}

	// restart() {}
}