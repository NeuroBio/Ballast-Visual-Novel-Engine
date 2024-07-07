import { Chapter } from './Chapter';

export interface ChapterDto {
	key: string,
	name: string,
	locked: boolean,
	firstSceneKey: string,
	scenes: string[],
}

interface ChapterFinderParams {
	dataFetcher: () => Promise<ChapterDto[]>;
}

export class ChapterFinder {
	#fetchData: () => Promise<ChapterDto[]>;
	#cache: { [key: string]: ChapterDto};
	constructor (params: ChapterFinderParams) {
		const { dataFetcher } = params;
		this.#fetchData = dataFetcher;
	}

	async byKey (chapterKey: string): Promise<Chapter> {
		if (!this.#cache || !this.#cache[chapterKey]) {
			await this.#refreshData();
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

	async #refreshData () {
		const rawData = await this.#fetchData();
		this.#cache = rawData.reduce((keyed: { [key: string]: ChapterDto}, data) => {
			keyed[data.key] = data;
			return keyed;
		}, {});
	}
}
