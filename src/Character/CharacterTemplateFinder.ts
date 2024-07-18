export interface CharacterTemplate {
	name: string;
	key: string;
	traits: { [key:string]: number };
}

interface CharacterTemplateFinderParams {
	findData: (key?: string) => Promise<CharacterTemplate[]>;
}

export class CharacterTemplateFinder {
	#findData: (key?: string) => Promise<CharacterTemplate[]>;
	#cache: CharacterTemplate[];

	constructor (params: CharacterTemplateFinderParams) {
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