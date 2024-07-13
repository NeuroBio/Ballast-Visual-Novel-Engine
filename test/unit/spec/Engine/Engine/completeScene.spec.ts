import { Engine } from '../../../../../src/Engine/Engine';
import { ChapterData, SavedDataData, SceneData } from '../../../FakeData/TestData';
import { Fakes } from '../../../fakes/index';
import { Scene } from '../../../fakes/Scene';

describe(`Engine.advanceScene`, () => {
	const Error = Object.freeze({
		NO_SCENE: 'You cannot call complete scene prior to starting a chapter.',
		TOO_EARLY: 'You cannot call complete scene while the scene is in progress.',
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
		// await engine.startChapter({ chapterKey: '' });
		return engine;
	}
	describe(`called before starting a scene`, () => {
		it(`throws an error`, async () => {
			const engine = await _createEngine();
			await expect(async () => {
				await engine.completeScene();
			}).rejects.toThrow(Error.NO_SCENE);
		});
	});
	describe(`called complete scene when current beat is not a final beat`, () => {
		it(`throws an error`, async () => {
			const engine = await _createEngine();
			await engine.startChapter({ chapterKey: '' });
			await expect(async () => {
				await engine.completeScene();
			}).rejects.toThrow(Error.TOO_EARLY);
		});
	});
});