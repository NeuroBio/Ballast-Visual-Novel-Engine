import { Engine } from '../../../../../src/Engine/Engine';
import { ChapterData, CharacterData, SavedDataData, SceneData } from '../../../FakeData/TestData';
import { Fakes } from '../../../fakes/index';
import { SavedData } from '../../../fakes/SavedData';
import { Scene } from '../../../fakes/Scene';

describe(`Engine.completeScene`, () => {
	const Error = Object.freeze({
		NO_SCENE: 'You cannot call complete scene prior to starting a chapter.',
		TOO_EARLY: 'You cannot call complete scene while the scene is in progress.',
	});
	let chapterFinderFake: any, sceneFinderFake: any, scene: Scene,
		saveData: SavedData, savedDataRepoFake: any;
	async function _createEngine (): Promise<Engine> {
		chapterFinderFake = new Fakes.ChapterFinder();
		sceneFinderFake = new Fakes.SceneFinder();
		savedDataRepoFake = new Fakes.SavedDataRepo();
		const chapter = new Fakes.Chapter();
		scene = new Fakes.Scene();
		const beat = new Fakes.SimpleBeat({});
		scene.start.mockReturnValueOnce(beat);
		saveData = new Fakes.SavedData();
		chapterFinderFake.byKey.mockReturnValueOnce(chapter);
		sceneFinderFake.byKey.mockReturnValueOnce(scene);
		savedDataRepoFake.findOrCreate.mockReturnValueOnce(saveData);
		const engine = new Engine({
			findChapterData: () => Promise.resolve(ChapterData),
			findSceneData: () => Promise.resolve(SceneData),
			findCharacterData: () => Promise.resolve(CharacterData),
			findSavedData: () => Promise.resolve(SavedDataData),
			saveSavedData: () => Promise.resolve(),
			chapterFinder: chapterFinderFake,
			sceneFinder: sceneFinderFake,
			savedDataRepo: savedDataRepoFake,
		});
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
			Object.defineProperty(scene, 'isComplete', { get: jest.fn(() => false) });
			await engine.startChapter({ chapterKey: '' });
			await expect(async () => {
				await engine.completeScene();
			}).rejects.toThrow(Error.TOO_EARLY);
		});
	});
	describe(`
		called complete scene when current beat is a final beat
		current chapter has a next scene queued up
	`, () => {
		beforeAll(async () => {
			const engine = await _createEngine();
			const currentScene = 'currentScene';
			Object.defineProperty(scene, 'isComplete', { get: jest.fn(() => true) });
			Object.defineProperty(scene, 'key', { get: jest.fn(() => currentScene) });
			saveData.startNewChapter(currentScene);
			saveData.getQueuedSceneForChapter.mockReturnValueOnce('nextScene');
			await engine.startChapter({ chapterKey: '' });
			await engine.completeScene();
		});
		it(`does not complete the chapter`, async () => {
			expect(saveData.completeChapter).not.toHaveBeenCalled();
		});
		it(`autosaves`, () => {
			expect(savedDataRepoFake.autosave).toHaveBeenCalled();
		});
		it(`resets the original and current data`, () => {
			expect(saveData.clone).toHaveBeenCalledTimes(2);
		});
	});
	describe(`
		called complete scene when current beat is a final beat
		current chapter does not have a next scene queued up
	`, () => {
		beforeAll(async () => {
			const engine = await _createEngine();
			const currentScene = 'currentScene';
			Object.defineProperty(scene, 'isComplete', { get: jest.fn(() => true) });
			Object.defineProperty(scene, 'key', { get: jest.fn(() => currentScene) });
			saveData.startNewChapter(currentScene);
			saveData.getQueuedSceneForChapter.mockReturnValueOnce('');
			await engine.startChapter({ chapterKey: '' });
			await engine.completeScene();
		});
		it(`completes the chapter`, () => {
			expect(saveData.completeChapter).toHaveBeenCalled();
		});
		it(`autosaves`, () => {
			expect(savedDataRepoFake.autosave).toHaveBeenCalled();
		});
		it(`resets the original and current data`, () => {
			expect(saveData.clone).toHaveBeenCalledTimes(2);
		});
	});
	describe(`
		called complete scene when current beat is a final beat
		current chapter's queued scene is the current scene
	`, () => {
		beforeAll(async () => {
			const engine = await _createEngine();
			const currentScene = 'currentScene';
			Object.defineProperty(scene, 'isComplete', { get: jest.fn(() => true) });
			Object.defineProperty(scene, 'key', { get: jest.fn(() => currentScene) });
			saveData.startNewChapter(currentScene);
			saveData.getQueuedSceneForChapter.mockReturnValueOnce('currentScene');
			await engine.startChapter({ chapterKey: '' });
			await engine.completeScene();
		});
		it(`completes the chapter`, () => {
			expect(saveData.completeChapter).toHaveBeenCalled();
		});
		it(`autosaves`, () => {
			expect(savedDataRepoFake.autosave).toHaveBeenCalled();
		});
		it(`resets the original and current data`, () => {
			expect(saveData.clone).toHaveBeenCalledTimes(2);
		});
	});
});