import { Beat, ChoiceBeatDisplay, FinalBeatDisplay, SimpleBeatDisplay } from '../Beat/Beat';

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