import { Chapter } from '../Chapter/Chapter';
import { ChapterFinder } from '../Chapter/ChapterFinder';
import { Scene } from '../Scene/Scene';
import { SceneFinder } from '../Scene/SceneFinder';

interface EngineParams {
	chapterFinder: ChapterFinder;
	sceneFinder: SceneFinder;
}
interface LoadChapterParams {
	chapterKey: string
}

export class Engine {
	#chapterFinder: ChapterFinder;
	#sceneFinder: SceneFinder;

	#currentChapter: Chapter;
	#currentScene: Scene;

	constructor (params: EngineParams) {
		this.#chapterFinder = params.chapterFinder || new ChapterFinder();
		this.#sceneFinder = params.sceneFinder || new SceneFinder();
	}

	getChapters () {
		// requires player

		// returns array of relevant chapters based on unknown criteria
	}

	startChapter (params: LoadChapterParams) {
		const { chapterKey } = params;
		this.#currentChapter = this.#chapterFinder.byKey(chapterKey);

		const sceneKey = this.#currentChapter.start();
		this.#currentScene = this.#sceneFinder.byKey(sceneKey);

		// const beatKey = this.#currentScene.start();


		// Chapter loads Scene by optional key
		// Scene plays first beat

		// updates character states as needed
		// returns UI display data
		// MVP: text + key to display
	}

	advanceScene () {
		// required beat key

		// Scene.play(beatKey)

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

	saveGame () {
		// save allowed/completed chapters
		// save completed scenes
		// save character states
	}
}