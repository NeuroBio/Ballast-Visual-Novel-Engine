import { Engine } from '../../../../../src/Engine/Engine';
import { ChapterData, SavedDataData, SceneData } from '../../../FakeData/TestData';
import { Fakes } from '../../../fakes/index';
import { Scene } from '../../../fakes/Scene';

describe(`Engine.advanceScene`, () => {
	const Error = Object.freeze({
		TOO_EARLY: 'You cannot call advance scene prior to starting a chapter.',
	});
	let chapterFinderFake: any, sceneFinderFake: any, scene: Scene, savedDataRepoFake: any;
	async function _createEngine (): Promise<Engine> {
		chapterFinderFake = new Fakes.ChapterFinder();
		sceneFinderFake = new Fakes.SceneFinder();
		savedDataRepoFake = new Fakes.SavedDataRepo();
		const chapter = new Fakes.Chapter();
		scene = new Fakes.Scene();
		chapterFinderFake.byKey.mockReturnValueOnce(chapter);
		sceneFinderFake.byKey.mockReturnValueOnce(scene);
		savedDataRepoFake.findOrCreate.mockReturnValueOnce(new Fakes.SavedData());
		const engine = new Engine({
			findChapterData: () => Promise.resolve(ChapterData),
			findSceneData: () => Promise.resolve(SceneData),
			findSavedData: () => Promise.resolve(SavedDataData),
			saveSavedData: () => Promise.resolve(),
			chapterFinder: chapterFinderFake,
			sceneFinder: sceneFinderFake,
			savedDataRepo: savedDataRepoFake,
		});
		await engine.startChapter({ chapterKey: '' });
		return engine;
	}
	describe(`called before setting a scene`, () => {
		it(`throws an error`, () => {
			chapterFinderFake = new Fakes.ChapterFinder();
			sceneFinderFake = new Fakes.SceneFinder();
			savedDataRepoFake = new Fakes.SavedDataRepo();
			const engine = new Engine({
				findChapterData: () => Promise.resolve(ChapterData),
				findSceneData: () => Promise.resolve(SceneData),
				findSavedData: () => Promise.resolve(SavedDataData),
				saveSavedData: () => Promise.resolve(),
				chapterFinder: chapterFinderFake,
				sceneFinder: sceneFinderFake,
				savedDataRepo: savedDataRepoFake,
			});
			const beatKey = 'beatKey';
			expect(() => {
				engine.advanceScene({ beatKey });
			}).toThrow(Error.TOO_EARLY);
		});
	});
	describe(`playing a beat with a next beat`, () => {
		const beatKey = 'beatKey';
		const beat = new Fakes.SimpleBeat({});
		const playResponse = { result: 'result' };
		beat.play.mockReturnValueOnce(playResponse);
		let result: any;

		beforeAll(async () => {
			const engine = await _createEngine();
			scene.next.mockReturnValueOnce(beat);
			result = engine.advanceScene({ beatKey });
		});
		it(`plays the scene's next beat`, () => {
			expect(scene.next).toHaveBeenCalled();
			expect(beat.play).toHaveBeenCalled();
		});
		it(`returns the beat data for display`, () => {
			expect(result).toEqual(playResponse);
		});
	});
});
