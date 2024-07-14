import { Engine } from '../../../../../src/Engine/Engine';
import { ChapterData, CharacterData, SavedDataData, SceneData } from '../../../FakeData/TestData';
import { Fakes } from '../../../fakes/index';
import { Scene } from '../../../fakes/Scene';

describe(`Engine.advanceScene`, () => {
	const Error = Object.freeze({
		TOO_EARLY: 'You cannot call advance scene prior to starting a chapter.',
	});
	let chapterFinderFake: any, sceneFinderFake: any, scene: Scene,
		savedDataRepoFake: any;
	async function _createEngine (): Promise<Engine> {
		chapterFinderFake = new Fakes.ChapterFinder();
		sceneFinderFake = new Fakes.SceneFinder();
		savedDataRepoFake = new Fakes.SavedDataRepo();
		const chapter = new Fakes.Chapter();
		const beat = new Fakes.SimpleBeat({});
		scene = new Fakes.Scene();
		scene.start.mockReturnValueOnce(beat);
		chapterFinderFake.byKey.mockReturnValueOnce(chapter);
		sceneFinderFake.byKey.mockReturnValueOnce(scene);
		savedDataRepoFake.findOrCreate.mockReturnValueOnce(new Fakes.SavedData());
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
				findCharacterData: () => Promise.resolve(CharacterData),
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
		const newBeat = new Fakes.SimpleBeat({});
		const playResponse = { text: 'result' };
		let result: any;

		beforeAll(async () => {
			const engine = await _createEngine();
			newBeat.play.mockReturnValueOnce(playResponse);
			scene.next.mockReturnValueOnce(newBeat);
			result = engine.advanceScene({ beatKey });
		});
		it(`plays the scene's next beat`, () => {
			expect(scene.next).toHaveBeenCalled();
			expect(newBeat.play).toHaveBeenCalled();
		});
		it(`returns the beat data for display`, () => {
			expect(result).toEqual(playResponse);
		});
	});
});
