import { SavedData } from './SavedData.js';
export class SavedDataRepo {
    #findData;
    #createData;
    #createDataDefault = () => {
        return Promise.resolve({
            activeChapters: {},
            unlockedChapters: [],
            completedChapters: [],
            inventory: {},
            achievements: [],
            characters: [],
        });
    };
    #autosave;
    #save;
    constructor(params) {
        const { findData, saveData, autosaveData, createData } = params;
        this.#findData = findData;
        this.#save = saveData;
        this.#autosave = autosaveData || saveData;
        this.#createData = createData || this.#createDataDefault;
    }
    async findOrCreate() {
        let data = await this.#findData();
        if (!data) {
            data = await this.#createData();
        }
        return new SavedData(data);
    }
    async autosave(saveData) {
        const dto = saveData.toDto();
        await this.#autosave(dto);
    }
    async save(saveData) {
        const dto = saveData.toDto();
        await this.#save(dto);
    }
}
