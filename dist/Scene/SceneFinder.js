import { BeatFactory } from '../Beat/BeatFactory.js';
import { Scene } from './Scene.js';
export class SceneFinder {
	#findData;
	#cache = {};
	constructor (params) {
		const { findData } = params;
		this.#findData = findData;
	}
	async byKey (sceneKey) {
		if (!this.#cache || !this.#cache[sceneKey]) {
			await this.#refreshData(sceneKey);
		}
		const data = this.#cache[sceneKey];
		if (!data) {
			return;
		}
		const beats = data.beats.reduce((keyed, beat) => {
			keyed[beat.key] = new BeatFactory().fromDto(beat);
			return keyed;
		}, {});
		return new Scene({ ...data, beats });
	}
	async #refreshData (key) {
		const rawData = await this.#findData(key);
		const refreshedData = rawData.reduce((keyed, data) => {
			keyed[data.key] = data;
			return keyed;
		}, {});
		this.#cache = { ...this.#cache, ...refreshedData };
	}
}
