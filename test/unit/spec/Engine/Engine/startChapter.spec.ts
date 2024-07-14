import { Engine } from '../../../../../src/Engine/Engine';
import { ChapterData, SavedDataData, SceneData } from '../../../FakeData/TestData';
import { Fakes } from '../../../fakes/index';

fdescribe(`Engine.startChapter`, () => {
	const Error = Object.freeze({
		NOT_FOUND: 'Requested chapter was not found.',
	});

	let chapterFinderFake: any, sceneFinderFake: any, savedDataRepoFake: any;
	async function _createEngine (): Promise<Engine> {
		chapterFinderFake = new Fakes.ChapterFinder();
		sceneFinderFake = new Fakes.SceneFinder();
		savedDataRepoFake = new Fakes.SavedDataRepo();
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
		return engine;
	}

	describe(`chapter is not found`, () => {
		it(`throws and error`, async () => {
			const chapterKey = 'noChapter';
			const engine = await _createEngine();
			await expect(async () => {
				await engine.startChapter({ chapterKey });
			}).rejects.toThrow(Error.NOT_FOUND);
		});
	});
	describe(`loading valid chapter for the first time`, () => {
		const chapterKey = 'chapterKey', sceneKey = 'sceneKey',
			scene = new Fakes.Scene(), beat = new Fakes.SimpleBeat({}),
			startResponse = { result: 'result' };
		let result: any;
		beforeAll(async () => {
			const engine = await _createEngine();
			const chapter = new Fakes.Chapter();
			chapter.start.mockReturnValueOnce(sceneKey);
			scene.start.mockReturnValueOnce(beat);
			beat.play.mockReturnValueOnce(startResponse);
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
			expect(beat.play).toHaveBeenCalled();
		});
		it(`returns the beat data for display`, () => {
			expect(result).toEqual(startResponse);
		});
	});
});
