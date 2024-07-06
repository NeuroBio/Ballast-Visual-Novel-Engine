interface SceneParams {
	beats: string[];
	firstBeatKey: string;
	name: string;
	key: string;
}

export class Scene {
	#beats: string[];
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
	// start()

	// play (): void {
	// 	this.#currentBeat.play();
	// }

	// next (selectedBeat?: string): void {
	// 	if (selectedBeat) {
	// 		this.#currentBeat = this.#beatData[selectedBeat];
	// 	}
	// }
}