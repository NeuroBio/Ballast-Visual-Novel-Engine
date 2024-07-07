import { Chapter } from '../Chapter/Chapter';
import { ChapterDto, ChapterFinder } from '../Chapter/ChapterFinder';
import { Scene } from '../Scene/Scene';
import { SceneDto, SceneFinder } from '../Scene/SceneFinder';

interface EngineParams {
	chapterDataFetcher: () => Promise<ChapterDto[]>;
	sceneDataFetcher: () => Promise<SceneDto[]>;
	chapterFinder?: ChapterFinder;
	sceneFinder?: SceneFinder;
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

	#currentChapter: Chapter;
	#currentScene: Scene;

	constructor (params: EngineParams) {
		const { chapterDataFetcher, sceneDataFetcher } = params;
		this.#chapterFinder = params.chapterFinder || new ChapterFinder({ dataFetcher: chapterDataFetcher });
		this.#sceneFinder = params.sceneFinder || new SceneFinder({ dataFetcher: sceneDataFetcher });
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

		// If the next beat is not present
		// unlock next scene (is any)
		// if final scene, unlock next chapter (if any)

		// returns UI display data
		// MVP: text + key to display

		// let the UI deal with the rest
	}

	advanceChapter () {
		// required scene key
		// Chapter.next(sceneKey)
		// Scene plays first beat
	}

	// needs to make a server call
	saveGame () {
		// save allowed/completed chapters
		// save completed scenes
		// save character states
	}
}