import { Chapter } from './Chapter';
export class ChapterFinder {
    #findData;
    #cache = {};
    constructor(params) {
        const { findData } = params;
        this.#findData = findData;
    }
    async byKey(chapterKey) {
        if (!this.#cache[chapterKey]) {
            await this.#refreshData();
        }
        const dto = this.#cache[chapterKey];
        return dto ? new Chapter(dto) : undefined;
    }
    async all() {
        if (Object.keys(this.#cache).length < 1) {
            await this.#refreshData();
        }
        return Object.values(this.#cache).map((dto) => new Chapter(dto));
    }
    async #refreshData(key) {
        const rawData = await this.#findData(key);
        const refreshedData = rawData.reduce((keyed, data) => {
            keyed[data.key] = data;
            return keyed;
        }, {});
        this.#cache = { ...this.#cache, ...refreshedData };
    }
}
