import { Chapter } from '../Chapter/Chapter';
import { ChapterDto, ChapterFinder } from '../Chapter/ChapterFinder';
import { CharacterDto } from '../Character/Character';
import { CharacterFinder } from '../Character/CharacterFinder';
import { SavedDataDto, SavedDataRepo } from '../SavedData/SaveDataRepo';
import { SavedData } from '../SavedData/SavedData';
import { Scene } from '../Scene/Scene';
import { SceneDto, SceneFinder } from '../Scene/SceneFinder';

interface EngineParams {
	findChapterData: (key?: string) => Promise<ChapterDto[]>;
	findSceneData: (key?: string) => Promise<SceneDto[]>;
	findCharacterData: () => Promise<CharacterDto[]>;
	findSavedData: () => Promise<SavedDataDto | void>;
	createSavedData?: () => Promise<SavedDataDto>;
	saveSavedData: (saveData: SavedDataDto) => Promise<void>;
	autosaveSaveData?: (saveData: SavedDataDto) => Promise<void>;
	chapterFinder?: ChapterFinder;
	sceneFinder?: SceneFinder;
	savedDataRepo?: SavedDataRepo;
	characterFinder?: CharacterFinder;
}
interface LoadChapterParams {
	chapterKey: string
}

interface AdvanceSceneParams {
	beatKey: string;
}

interface getChaptersParams {
	excludeLocked?: boolean;
	excludeUnlocked?: boolean;
}

export class Engine {
	#chapterFinder: ChapterFinder;
	#sceneFinder: SceneFinder;
	#characterFinder: CharacterFinder;
	#savedDataRepo: SavedDataRepo;

	#originalSave: SavedData;
	#currentSave: SavedData;
	#currentChapter: Chapter;
	#currentScene: Scene;

	constructor (params: EngineParams) {
		const { findChapterData, findSceneData, findSavedData, findCharacterData,
			createSavedData, saveSavedData, autosaveSaveData } = params;
		this.#chapterFinder = params.chapterFinder || new ChapterFinder({ findData: findChapterData });
		this.#sceneFinder = params.sceneFinder || new SceneFinder({ findData: findSceneData });
		this.#characterFinder = params.characterFinder || new CharacterFinder({ findData: findCharacterData });
		this.#savedDataRepo = params.savedDataRepo || new SavedDataRepo({
			findData: findSavedData,
			createData: createSavedData,
			saveData: saveSavedData,
			autosaveData: autosaveSaveData,
		});
	}

	async loadSavedData () {
		const latestSaveData = await this.#savedDataRepo.findOrCreate();
		this.#refreshSave(latestSaveData);
	}

	#refreshSave (latestSaveData: SavedData) {
		this.#originalSave = latestSaveData;
		this.#currentSave = this.#originalSave.clone();
	}

	async getChapters (params: getChaptersParams = {}) {
		const { excludeLocked, excludeUnlocked } = params;

		if (!this.#currentSave) {
			await this.loadSavedData();
		}

		let chapters = await this.#chapterFinder.all();
		chapters.forEach(chapter => chapter.reload(this.#currentSave.getChapterData(chapter.key)));


		if (excludeLocked) {
			chapters = chapters.filter((chap) => !chap.isLocked);
		}

		if (excludeUnlocked) {
			chapters = chapters.filter((chap) => chap.isLocked);
		}

		return chapters;
	}

	async startChapter (params: LoadChapterParams) {
		const { chapterKey } = params;

		if (!this.#currentSave) {
			await this.loadSavedData();
		}

		this.#currentChapter = await this.#findChapterElseThrow(chapterKey);

		const sceneKey = this.#currentChapter.start();
		this.#currentScene = await this.#sceneFinder.byKey(sceneKey);
		const beat = this.#currentScene.start();
		return beat.play(this.#currentSave.characters);
	}

	async #findChapterElseThrow (chapterKey: string): Promise<Chapter> {
		const chapter = await this.#chapterFinder.byKey(chapterKey);

		if (!chapter) {
			throw new Error('Requested chapter was not found.');
		}

		chapter.reload(this.#currentSave.getChapterData(chapter.key));

		return chapter;
	}

	advanceScene (params: AdvanceSceneParams) {
		if (!this.#currentScene) {
			throw new Error('You cannot call advance scene prior to starting a chapter.');
		}

		const { beatKey } = params;
		// this needs to...
		//   - queue scenes for chapters
		//   - unlock chapters
		//   - unlock achievements
		//   - add to inventory
		//   - remove from inventory
		//   - add memory
		//   - remove memory
		//   - update sentiment

		const currentBeat = this.#currentScene.next(beatKey);
		return currentBeat.play(this.#currentSave.characters);
	}

	async completeScene () {
		if (!this.#currentScene) {
			throw new Error('You cannot call complete scene prior to starting a chapter.');
		}

		if (!this.#currentScene.isComplete) {
			throw new Error('You cannot call complete scene while the scene is in progress.');
		}

		const nextScene = this.#currentSave.getQueuedSceneForChapter(this.#currentChapter.key);
		if (this.#currentScene.key === nextScene || nextScene === '') {
			this.#currentSave.completeChapter(this.#currentChapter.key);
		}

		await this.#savedDataRepo.autosave(this.#currentSave);
		this.#refreshSave(this.#currentSave);
	}

	async save () {
		if (!this.#currentSave) {
			throw new Error('You cannot save data prior to loading save data.');
		}

		await this.#savedDataRepo.save(this.#currentSave);
	}
}