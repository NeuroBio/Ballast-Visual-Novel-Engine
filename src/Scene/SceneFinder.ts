import { Beat } from '../Beat/Beat';
import { BeatDto, BeatFactory } from '../Beat/BeatFactory';
import { Scene } from './Scene';


export interface SceneDto {
	name: string,
	key: string,
	firstBeatKey: string,
	locked: boolean,
	beats: BeatDto[],
}

interface SceneFinderParams {
	dataFetcher: () => Promise<SceneDto[]>;
}

export class SceneFinder {
	#fetchData: () => Promise<SceneDto[]>;
	#cache: { [key: string]: SceneDto};

	constructor (params: SceneFinderParams) {
		const { dataFetcher } = params;
		this.#fetchData = dataFetcher;
	}

	async byKey (sceneKey: string): Promise<Scene> {
		if (!this.#cache || !this.#cache[sceneKey]) {
			await this.#refreshData();
		}

		const data = this.#cache[sceneKey];
		if (!data) {
			throw new Error('Requested scene was not found.');
		}

		if (data.locked) {
			throw new Error('This scene has not yet been unlocked.');
		}

		const beats = data.beats.reduce((keyed: { [key: string]: Beat}, beat) => {
			keyed[beat.key] = new BeatFactory().fromDto(beat);
			return keyed;
		}, {});
		return new Scene({ ...data, beats });
	}

	async #refreshData () {
		const rawData = await this.#fetchData();
		this.#cache = rawData.reduce((keyed: { [key: string]: SceneDto}, data) => {
			keyed[data.key] = data;
			return keyed;
		}, {});
	}
}
