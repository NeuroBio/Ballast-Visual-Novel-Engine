import { Character, CharacterDto } from './Character';

interface CharacterFinderParams {
	findData: (key?: string) => Promise<CharacterDto[]>;
}

export class CharacterFinder {
	#findData: (key?: string) => Promise<CharacterDto[]>;
	#cache: { [key: string]: CharacterDto} = {};

	constructor (params: CharacterFinderParams) {
		const { findData } = params;
		this.#findData = findData;
	}

	async all (): Promise<Character[]> {
		if (Object.keys(this.#cache).length < 1) {
			await this.#refreshData();
		}

		return Object.values(this.#cache).map((dto) => new Character(dto));
	}

	async #refreshData (key?: string) {
		const rawData = await this.#findData(key);
		const refreshedData = rawData.reduce((keyed: { [key: string]: CharacterDto}, data) => {
			keyed[data.key] = data;
			return keyed;
		}, {});
		this.#cache = { ...this.#cache, ...refreshedData };
	}
}