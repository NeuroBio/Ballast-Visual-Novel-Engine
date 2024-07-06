import { Beat, BeatParams } from '../Beat/Beat';

interface SceneParams {
	beatData: { [id: string]: BeatParams };
	firstBeat: string;
}

export class Scene {
	#beatData: { [id: string]: BeatParams };
	#currentBeatKey: string;
	#currentBeat: Beat;

	constructor (params: SceneParams) {
		const { beatData, firstBeatKey } = params;
		this.#beatData = beatData;
		this.#currentBeatKey = firstBeatKey;
		this.#currentBeat = new Beat(this.#beatData[this.#currentBeatKey]);
	}

	play (): void {
		this.#currentBeat.play();
	}

	next (selectedBeat?: string): void {
		if (selectedBeat) {
			this.#currentBeat = new Beat(this.#beatData[selectedBeat]);
		} else {
			this.end();
		}
	}

	end (): void {

	}
}