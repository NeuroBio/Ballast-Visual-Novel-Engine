export interface CharacterTemplate {
	name: string;
	key: string;
	sentiments: { [key:string]: number };
}

interface CharacterFinderParams { // rename to CharacterTemplate
	findData: (key?: string) => Promise<CharacterTemplate[]>;
}

export class CharacterFinder {
	#findData: (key?: string) => Promise<CharacterTemplate[]>;
	#cache: CharacterTemplate[];

	constructor (params: CharacterFinderParams) {
		const { findData } = params;
		this.#findData = findData;
	}

	async all (): Promise<CharacterTemplate[]> {
		if (!this.#cache) {
			await this.#refreshData();
		}

		return this.#cache.map((char) => ({ ...char }));
	}

	async #refreshData (key?: string) {
		this.#cache = await this.#findData(key);
	}
}