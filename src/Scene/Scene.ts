import { Beat } from '../Beat/Beat';

interface SceneParams {
	beatData: { [id: string]: Beat };
	firstBeatKey: string;
}

export class Scene {
	#beatData: { [id: string]: Beat };
	#currentBeatKey: string;
	#currentBeat: Beat;

	constructor (params: SceneParams) {
		const { beatData, firstBeatKey } = params;

		this.#beatData = beatData;
		this.#currentBeatKey = firstBeatKey;
		this.#currentBeat = this.#beatData[this.#currentBeatKey];
	}

	play (): void {
		this.#currentBeat.play();
	}

	next (selectedBeat?: string): void {
		if (selectedBeat) {
			this.#currentBeat = this.#beatData[selectedBeat];
		}
	}
}