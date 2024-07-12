import { SavedData } from './SavedData';

export interface SavedDataDto {
	activeChapters: { [chapterKey: string]: string };
	unlockedChapters: string[];
	completedChapters: string[];
	inventory: { [itemKey: string]: number };
	achievements: string[];
	// characters: { [characterKey: string]: CharacterDto }
}

interface SavedDataRepoParams {
	findData: () => Promise<SavedDataDto | void>;
	createData?: () => Promise<SavedDataDto>;
	// update this to take two mechanisms: autoSaveData manualSaveData
	saveData: (saveData: SavedDataDto) => Promise<void>;
}

export class SavedDataRepo {
	#findData: () => Promise<SavedDataDto | void>;
	#createData: () => Promise<SavedDataDto>;
	#createDataDefault = () => {
		return Promise.resolve({
			activeChapters: {},
			unlockedChapters: [],
			completedChapters: [],
			inventory: {},
			achievements: [],
			// characters: {},
		});
	};
	#upsertData: (saveData: SavedDataDto) => Promise<void>;

	constructor (params: SavedDataRepoParams) {
		const { findData, saveData, createData } = params;
		this.#findData = findData;
		this.#upsertData = saveData;
		this.#createData = createData || this.#createDataDefault;
	}

	async findOrCreate (): Promise<SavedData> {
		let data = await this.#findData();
		if (!data) {
			data = await this.#createData();
		}

		return new SavedData(data);
	}

	async upsert (saveData: SavedData): Promise<void> {
		const dto = saveData.toDto();
		await this.#upsertData(dto);
	}
}