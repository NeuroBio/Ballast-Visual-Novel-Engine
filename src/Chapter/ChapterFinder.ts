import { Chapter } from './Chapter';

export interface ChapterDto {
	key: string,
	name: string,
	locked: boolean,
	firstSceneKey: string,
	scenes: string[],
}

interface ChapterFinderParams {
	dataFetcher: () => ChapterDto[];
}

export class ChapterFinder {
	#fetchData: () => ChapterDto[];
	#cache: { [key: string]: ChapterDto};
	constructor (params: ChapterFinderParams) {
		const { dataFetcher } = params;
		this.#fetchData = dataFetcher;
	}

	byKey (chapterKey: string): Chapter {
		if (!this.#cache || !this.#cache[chapterKey]) {
			this.#refreshData();
		}

		const data = this.#cache[chapterKey];
		if (!data) {
			throw new Error('Requested chapter was not found.');
		}

		if (data.locked) {
			throw new Error('This chapter has not yet been unlocked.');
		}

		return new Chapter(data);
	}

	#refreshData () {
		const rawData = this.#fetchData();
		this.#cache = rawData.reduce((keyed: { [key: string]: ChapterDto}, data) => {
			keyed[data.key] = data;
			return keyed;
		}, {});
	}
}
