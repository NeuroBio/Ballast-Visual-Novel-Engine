import { Chapter } from '../Chapter/Chapter';
import { ChapterDto, ChapterFinder } from '../Chapter/ChapterFinder';
import { SavedDataDto, SavedDataRepo } from '../SavedData/SaveDataRepo';
import { Scene } from '../Scene/Scene';
import { SceneDto, SceneFinder } from '../Scene/SceneFinder';

interface EngineParams {
	chapterDataFetcher: (key?: string) => Promise<ChapterDto[]>;
	sceneDataFetcher: (key?: string) => Promise<SceneDto[]>;
	findSavedData: () => Promise<SavedDataDto>;
	createSavedData?: () => Promise<SavedDataDto>;
	saveSavedData: (saveData: SavedDataDto) => Promise<void>;
	// savedDataFetcher: () => Promise<any>;
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
export class Engine {
	#chapterFinder: ChapterFinder;
	#sceneFinder: SceneFinder;
	#savedDataRepo: SavedDataRepo;

	#currentChapter: Chapter;
	#currentScene: Scene;

	constructor (params: EngineParams) {
		const { chapterDataFetcher, sceneDataFetcher, findSavedData, createSavedData, saveSavedData } = params;
		this.#chapterFinder = params.chapterFinder || new ChapterFinder({ dataFetcher: chapterDataFetcher });
		this.#sceneFinder = params.sceneFinder || new SceneFinder({ dataFetcher: sceneDataFetcher });
		this.#savedDataRepo = params.savedDataRepo || new SavedDataRepo({
			findData: findSavedData,
			createData: createSavedData,
			saveData: saveSavedData,
		});
	}

	async loadSavedData () {
		// get the data
		// store it in local cache
	}

	// needs to make a server call
	getChapters () {
		// requires player

		// returns array of relevant chapters based on unknown criteria
	}

	async startChapter (params: LoadChapterParams) {
		const { chapterKey } = params;
		this.#currentChapter = await this.#chapterFinder.byKey(chapterKey);

		const sceneKey = this.#currentChapter.start();
		this.#currentScene = await this.#sceneFinder.byKey(sceneKey);
		return this.#currentScene.start();
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