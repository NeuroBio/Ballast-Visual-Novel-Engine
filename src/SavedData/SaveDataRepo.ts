// import { SavedData } from './SavedData';

import { SavedData } from './SavedData';

export interface SavedDataDto {
	priorChapterKey: string;
	priorSceneKey: string;
	currentChapterKey: string;
	currentSceneKey: string;
	achievementKeys: string[];
	completedChapterKeys: string[];
}

interface SavedDataRepoParams {
	findData: () => Promise<SavedDataDto | undefined>;
	createData?: () => Promise<SavedDataDto>;
	saveData: (saveData: SavedDataDto) => Promise<void>;
}

export class SavedDataRepo {
	#findData: () => Promise<SavedDataDto | undefined>;
	#createData: () => Promise<SavedDataDto>;
	#createDataDefault = () => {
		return Promise.resolve({
			priorChapterKey: '',
			priorSceneKey: '',
			currentChapterKey: '',
			currentSceneKey: '',
			achievementKeys: [],
			completedChapterKeys: [],
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