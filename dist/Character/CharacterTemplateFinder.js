export class CharacterTemplateFinder {
    #findData;
    #cache;
    constructor(params) {
        const { findData } = params;
        this.#findData = findData;
    }
    async all() {
        if (!this.#cache) {
            await this.#refreshData();
        }
        return this.#cache.map((char) => ({ ...char }));
    }
    async #refreshData(key) {
        this.#cache = await this.#findData(key);
    }
}
