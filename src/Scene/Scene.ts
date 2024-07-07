import { Beat, ChoiceBeatDisplay, FinalBeatDisplay, SimpleBeatDisplay } from '../Beat/Beat';

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

	// restart()
	start (): SimpleBeatDisplay | ChoiceBeatDisplay | FinalBeatDisplay {
		return this.#beats[this.#currentBeatKey].play();
	}

	next (beatKey: string): SimpleBeatDisplay | ChoiceBeatDisplay | FinalBeatDisplay {
		this.#currentBeatKey = beatKey;
		return this.#beats[this.#currentBeatKey].play();
	}


	// play (): void {
	// 	this.#currentBeat.play();
	// }

	// next (selectedBeat?: string): void {
	// 	if (selectedBeat) {
	// 		this.#currentBeat = this.#beatData[selectedBeat];
	// 	}
	// }
}