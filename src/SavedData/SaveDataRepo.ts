// import { SavedData } from './SavedData';

export interface SavedDataDto {
	currentChapterKey: string;
	currentSceneKey: string;
	achievementKeys: string[];
	completeChapterKeys: string[];
}

interface SavedDataRepoParams {
	fetchData: () => Promise<SavedDataDto>;
	saveData: (saveData: SavedDataDto) => Promise<void>;
}

export class SavedDataRepo {
	#fetchData: () => Promise<SavedDataDto>;
	#saveData: (saveData: SavedDataDto) => Promise<void>;

	constructor (params: SavedDataRepoParams) {
		const { fetchData, saveData } = params;
		this.#fetchData = fetchData;
		this.#saveData = saveData;
	}

	// find (): SavedData {

	// }

	// upsert (saveData: SavedData): void {

	// }
}