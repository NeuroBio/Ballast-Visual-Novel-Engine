import { CharacterDto } from '../Character/Character';
import { SavedData } from './SavedData';

export interface SavedDataDto {
	activeChapters: { [chapterKey: string]: string };
	unlockedChapters: string[];
	completedChapters: string[];
	inventory: { [itemKey: string]: number };
	achievements: string[];
	characters: CharacterDto[];
}

interface SavedDataRepoParams {
	findData: () => Promise<SavedDataDto | void>;
	createData?: () => Promise<SavedDataDto>;
	saveData: (saveData: SavedDataDto) => Promise<void>;
	autosaveData?: (saveData: SavedDataDto) => Promise<void>;
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
			characters: [],
		});
	};
	#autosave: (saveData: SavedDataDto) => Promise<void>;
	#save: (saveData: SavedDataDto) => Promise<void>;

	constructor (params: SavedDataRepoParams) {
		const { findData, saveData, autosaveData, createData } = params;
		this.#findData = findData;
		this.#save = saveData;
		this.#autosave = autosaveData || saveData;
		this.#createData = createData || this.#createDataDefault;
	}

	async findOrCreate (): Promise<SavedData> {
		let data = await this.#findData();
		if (!data) {
			data = await this.#createData();
		}

		return new SavedData(data);
	}

	async autosave (saveData: SavedData): Promise<void> {
		const dto = saveData.toDto();
		await this.#autosave(dto);
	}

	async save (saveData: SavedData): Promise<void> {
		const dto = saveData.toDto();
		await this.#save(dto);
	}
}