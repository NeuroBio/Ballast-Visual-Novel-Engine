import { Chapter } from './Chapter';

export interface ChapterDto {
	key: string,
	name: string,
	locked: boolean,
	firstSceneKey: string,
	scenes: string[],
}

interface ChapterFinderParams {
	dataFetcher: (key?: string) => Promise<ChapterDto[]>;
}

export class ChapterFinder {
	#fetchData: (key?: string) => Promise<ChapterDto[]>;
	#cache: { [key: string]: ChapterDto} = {};

	constructor (params: ChapterFinderParams) {
		const { dataFetcher } = params;
		this.#fetchData = dataFetcher;
	}

	async byKey (chapterKey: string): Promise<Chapter> {
		if (!this.#cache[chapterKey]) {
			await this.#refreshData();
		}

		const data = this.#cache[chapterKey];
		if (!data) {
			throw new Error('Requested chapter was not found.');
		}

		const chapter = new Chapter(data);

		if (chapter.isLocked()) {
			throw new Error('This chapter has not yet been unlocked.');
		}

		return chapter;
	}

	async #refreshData (key?: string) {
		const rawData = await this.#fetchData(key);
		const refreshedData = rawData.reduce((keyed: { [key: string]: ChapterDto}, data) => {
			keyed[data.key] = data;
			return keyed;
		}, {});
		this.#cache = { ...this.#cache, ...refreshedData };
	}
}
