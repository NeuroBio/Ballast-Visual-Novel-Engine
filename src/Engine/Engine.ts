import { Chapter } from '../Chapter/Chapter';
import { ChapterDto, ChapterFinder } from '../Chapter/ChapterFinder';
import { SavedDataDto, SavedDataRepo } from '../SavedData/SaveDataRepo';
import { SavedData } from '../SavedData/SavedData';
import { Scene } from '../Scene/Scene';
import { SceneDto, SceneFinder } from '../Scene/SceneFinder';

interface EngineParams {
	findChapterData: (key?: string) => Promise<ChapterDto[]>;
	findSceneData: (key?: string) => Promise<SceneDto[]>;
	findSavedData: () => Promise<SavedDataDto | void>;
	createSavedData?: () => Promise<SavedDataDto>;
	saveSavedData: (saveData: SavedDataDto) => Promise<void>;
	chapterFinder?: ChapterFinder;
	sceneFinder?: SceneFinder;
	savedDataRepo?: SavedDataRepo;
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
	#savedDataRepo: SavedDataRepo;

	#originalSave: SavedData;
	#currentSave: SavedData;
	#currentChapter: Chapter;
	#currentScene: Scene;

	constructor (params: EngineParams) {
		const { findChapterData, findSceneData, findSavedData, createSavedData, saveSavedData } = params;
		this.#chapterFinder = params.chapterFinder || new ChapterFinder({ findData: findChapterData });
		this.#sceneFinder = params.sceneFinder || new SceneFinder({ findData: findSceneData });
		this.#savedDataRepo = params.savedDataRepo || new SavedDataRepo({
			findData: findSavedData,
			createData: createSavedData,
			saveData: saveSavedData,
		});
	}

	async loadSavedData () {
		this.#originalSave = await this.#savedDataRepo.findOrCreate();
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
		this.#currentChapter = await this.#findChapterElseThrow(chapterKey);

		const sceneKey = this.#currentChapter.start();
		this.#currentScene = await this.#sceneFinder.byKey(sceneKey);
		return this.#currentScene.start();
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
		const { beatKey } = params;
		return this.#currentScene.next(beatKey);
	}

	async advanceChapter () {
		// const sceneKey = this.#currentScene.advance();
		// this.#currentScene = await this.#sceneFinder.byKey(sceneKey);
		// return this.#currentScene.start();
	}


	saveGame () {
		// save allowed/completed chapters
		// save completed scenes
		// save character states
	}

	async storeSavedData () {
		// save data for reals
	}
}