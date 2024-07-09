import { Chapter } from './Chapter';

export interface ChapterDto {
	key: string,
	name: string,
	locked: boolean,
	firstSceneKey: string,
	sceneKeys: string[],
}

interface ChapterFinderParams {
	findData: (key?: string) => Promise<ChapterDto[]>;
}

export class ChapterFinder {
	#findData: (key?: string) => Promise<ChapterDto[]>;
	#cache: { [key: string]: ChapterDto} = {};

	constructor (params: ChapterFinderParams) {
		const { findData } = params;
		this.#findData = findData;
	}

	async byKey (chapterKey: string): Promise<Chapter | undefined> {
		if (!this.#cache[chapterKey]) {
			await this.#refreshData();
		}

		const dto = this.#cache[chapterKey];
		return dto ? new Chapter(dto) : undefined;
	}

	async all (): Promise<Chapter[]> {
		if (Object.keys(this.#cache).length < 1) {
			await this.#refreshData();
		}

		return Object.values(this.#cache).map((dto) => new Chapter(dto));
	}

	async #refreshData (key?: string) {
		const rawData = await this.#findData(key);
		const refreshedData = rawData.reduce((keyed: { [key: string]: ChapterDto}, data) => {
			keyed[data.key] = data;
			return keyed;
		}, {});
		this.#cache = { ...this.#cache, ...refreshedData };
	}
}
