import { Engine } from '../../../../../src/Engine/Engine';
import { ChapterData, SavedDataData, SceneData } from '../../../FakeData/TestData';
import { Fakes } from '../../../fakes/index';

describe(`Engine.startChapter`, () => {
	let chapterFinderFake: any, sceneFinderFake: any, savedDataRepoFake: any;
	function _createEngine (): Engine {
		chapterFinderFake = new Fakes.ChapterFinder();
		sceneFinderFake = new Fakes.SceneFinder();
		savedDataRepoFake = new Fakes.SavedDataRepo();
		return new Engine({
			findChapterData: () => Promise.resolve(ChapterData),
			findSceneData: () => Promise.resolve(SceneData),
			findSavedData: () => Promise.resolve(SavedDataData),
			saveSavedData: () => Promise.resolve(),
			chapterFinder: chapterFinderFake,
			sceneFinder: sceneFinderFake,
			savedDataRepo: savedDataRepoFake,
		});
	}
	describe(`loading chapter for the first time`, () => {
		const chapterKey = 'chapterKey', sceneKey = 'sceneKey',
			scene = new Fakes.Scene(), startResponse = { result: 'result' };
		let result: any;
		beforeAll(async () => {
			const engine = _createEngine();
			const chapter = new Fakes.Chapter();
			chapter.start.mockReturnValueOnce(sceneKey);
			scene.start.mockReturnValueOnce(startResponse);
			chapterFinderFake.byKey.mockReturnValueOnce(chapter);
			sceneFinderFake.byKey.mockReturnValueOnce(scene);
			result = await engine.startChapter({ chapterKey });
		});
		it(`calls chapterFinder with correct key`, () => {
			expect(chapterFinderFake.byKey).toHaveBeenCalledWith(chapterKey);
		});
		it(`calls sceneFinder with correct key`, () => {
			expect(sceneFinderFake.byKey).toHaveBeenCalledWith(sceneKey);
		});
		it(`plays the scene's first beat`, () => {
			expect(scene.start).toHaveBeenCalled();
		});
		it(`returns the beat data for display`, () => {
			expect(result).toEqual(startResponse);
		});
	});
});
