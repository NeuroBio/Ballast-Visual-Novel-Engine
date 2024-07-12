import { Engine } from '../../../../../src/Engine/Engine';
import { ChapterData, SavedDataData, SceneData } from '../../../FakeData/TestData';
import { Fakes } from '../../../fakes/index';
import { Scene } from '../../../fakes/Scene';

describe(`Engine.advanceScene`, () => {
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
		await engine.loadSavedData();
		await engine.startChapter({ chapterKey: '' });
		return engine;
	}
	describe(`playing a beat with a next beat`, () => {
		const beatKey = 'beatKey', playResponse = { result: 'result' };
		let result: any;

		beforeAll(async () => {
			const engine = await _createEngine();
			scene.next.mockReturnValueOnce(playResponse);
			result = engine.advanceScene({ beatKey });
		});
		it(`plays the scene's next beat`, () => {
			expect(scene.next).toHaveBeenCalled();
		});
		it(`returns the beat data for display`, () => {
			expect(result).toEqual(playResponse);
		});
	});
});
