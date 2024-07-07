import { Beat } from '../Beat/Beat';
import { BeatFinder } from '../Beat/BeatFinder';
import { Chapter } from '../Chapter/Chapter';
import { ChapterDto, ChapterFinder } from '../Chapter/ChapterFinder';
import { Scene } from '../Scene/Scene';
import { SceneFinder } from '../Scene/SceneFinder';

interface EngineParams {
	chapterFinder?: ChapterFinder;
	sceneFinder?: SceneFinder;
	beatFinder?: BeatFinder;
	chapterDataFetcher: () => ChapterDto[];
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
	#beatFinder: BeatFinder;

	#currentChapter: Chapter;
	#currentScene: Scene;
	#currentBeat: Beat;

	constructor (params: EngineParams) {
		const { chapterDataFetcher } = params;
		this.#chapterFinder = params.chapterFinder || new ChapterFinder({ dataFetcher: chapterDataFetcher });
		this.#sceneFinder = params.sceneFinder || new SceneFinder();
		this.#beatFinder = params.beatFinder || new BeatFinder();
	}

	// needs to make a server call
	getChapters () {
		// requires player

		// returns array of relevant chapters based on unknown criteria
	}

	startChapter (params: LoadChapterParams) {
		const { chapterKey } = params;
		this.#currentChapter = this.#chapterFinder.byKey(chapterKey);

		const sceneKey = this.#currentChapter.start();
		this.#currentScene = this.#sceneFinder.byKey(sceneKey);

		const beatKey = this.#currentScene.start();
		this.#currentBeat = this.#beatFinder.byKey(beatKey);
		return this.#currentBeat.play();
	}

	advanceScene (params: AdvanceSceneParams) {
		const { beatKey } = params;
		this.#currentBeat = this.#beatFinder.byKey(beatKey);
		return this.#currentBeat.play();

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