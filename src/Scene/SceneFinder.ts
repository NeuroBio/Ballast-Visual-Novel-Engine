import { Beat } from '../Beat/Beat';
import { BeatDto, BeatFactory } from '../Beat/BeatFactory';
import { Scene } from './Scene';


export interface SceneDto {
	name: string,
	key: string,
	firstBeatKey: string,
	beats: BeatDto[],
}

interface SceneFinderParams {
	findData: (key?: string) => Promise<SceneDto[]>;
}

export class SceneFinder {
	#findData: (key?: string) => Promise<SceneDto[]>;
	#cache: { [key: string]: SceneDto} = {};

	constructor (params: SceneFinderParams) {
		const { findData } = params;
		this.#findData = findData;
	}

	async byKey (sceneKey: string): Promise<Scene> {
		if (!this.#cache || !this.#cache[sceneKey]) {
			await this.#refreshData(sceneKey);
		}

		const data = this.#cache[sceneKey];
		if (!data) {
			throw new Error('Requested scene was not found.');
		}

		const beats = data.beats.reduce((keyed: { [key: string]: Beat}, beat) => {
			keyed[beat.key] = new BeatFactory().fromDto(beat);
			return keyed;
		}, {});
		return new Scene({ ...data, beats });
	}

	async #refreshData (key?: string) {
		const rawData = await this.#findData(key);
		const refreshedData = rawData.reduce((keyed: { [key: string]: SceneDto}, data) => {
			keyed[data.key] = data;
			return keyed;
		}, {});
		this.#cache = { ...this.#cache, ...refreshedData };
	}
}
