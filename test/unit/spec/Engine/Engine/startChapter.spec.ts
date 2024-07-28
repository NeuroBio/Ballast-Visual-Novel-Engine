import { Engine } from '../../../../../src/Engine/Engine';
import { ChapterData, CharacterData, SavedDataData, SceneData } from '../../../FakeData/TestData';
import { Fakes } from '../../../fakes/index';

fdescribe(`Engine.startChapter`, () => {
	const Error = Object.freeze({
		CHAP_NOT_FOUND: 'Requested chapter was not found.',
		SCENE_NOT_FOUND: 'Requested scene was not found.',
		UNDEFINED_BEAT: `Requested Beat is missing from the Scene data.`,
		NONSENSE_BEAT: `Requested Beat isn't a real beat.`,
		NO_RESTART: `Cannot start a new chapter while a scene is in progress.  Did you mean to call "restartScene?"`,
	});
	const saveData = Object.freeze({
		queuedScenes: [],
		unlockedChapters: [],
		unlockedAchievements: [],
		addedItems: [],
		removedItems: [],
		addedMemories: [],
		removedMemories: [],
		updatedCharacterTraits: [],
	});

	let chapterFinderFake: any, sceneFinderFake: any, savedDataRepoFake: any,
		characterTemplateFinderFake: any;
	async function _createEngine (): Promise<Engine> {
		chapterFinderFake = new Fakes.ChapterFinder();
		sceneFinderFake = new Fakes.SceneFinder();
		savedDataRepoFake = new Fakes.SavedDataRepo();
		savedDataRepoFake.findOrCreate.mockReturnValueOnce(new Fakes.SavedData());
		characterTemplateFinderFake = new Fakes.CharacterTemplateFinder();
		const engine = new Engine({
			findChapterData: () => Promise.resolve(ChapterData),
			findSceneData: () => Promise.resolve(SceneData),
			findCharacterData: () => Promise.resolve(CharacterData),
			findSavedData: () => Promise.resolve(SavedDataData),
			saveSavedData: () => Promise.resolve(),
			characterTemplateFinder: characterTemplateFinderFake,
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
			}).rejects.toThrow(Error.CHAP_NOT_FOUND);
		});
	});
	describe(`scene is not found`, () => {
		it(`throws and error`, async () => {
			const chapterKey = 'noChapter';
			const engine = await _createEngine();
			const chapter = new Fakes.Chapter();
			chapterFinderFake.byKey.mockReturnValueOnce(chapter);
			await expect(async () => {
				await engine.startChapter({ chapterKey });
			}).rejects.toThrow(Error.SCENE_NOT_FOUND);
		});
	});
	describe(`loading valid chapter for the first time`, () => {
		const chapterKey = 'chapterKey', sceneKey = 'sceneKey',
			scene = new Fakes.Scene(), beat = new Fakes.SimpleBeat({ key: 'key', saveData });
		const startResponse = { result: 'result', saveData: saveData };
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
	describe(`next best doesn't exist and isn't referenced by scene`, () => {
		it(`throws an error`, async () => {
			const chapterKey = 'chapterKey', sceneKey = 'sceneKey', scene = new Fakes.Scene();
			const engine = await _createEngine();
			const chapter = new Fakes.Chapter();
			chapter.start.mockReturnValueOnce(sceneKey);
			chapterFinderFake.byKey.mockReturnValueOnce(chapter);
			sceneFinderFake.byKey.mockReturnValueOnce(scene);
			scene.hasBeatReference.mockReturnValueOnce(false);

			await expect(async () => await engine.startChapter({ chapterKey }))
				.rejects.toThrow(Error.NONSENSE_BEAT);
		});
	});
	describe(`next best doesn't exist and is referenced by scene`, () => {
		it(`throws an error`, async () => {
			const chapterKey = 'chapterKey', sceneKey = 'sceneKey', scene = new Fakes.Scene();
			const engine = await _createEngine();
			const chapter = new Fakes.Chapter();
			chapter.start.mockReturnValueOnce(sceneKey);
			chapterFinderFake.byKey.mockReturnValueOnce(chapter);
			sceneFinderFake.byKey.mockReturnValueOnce(scene);
			scene.hasBeatReference.mockReturnValueOnce(true);

			await expect(async () => await engine.startChapter({ chapterKey }))
				.rejects.toThrow(Error.UNDEFINED_BEAT);
		});
	});
	describe(`trying to start a chapter while a chapter is already in progress`, () => {
		it(`throws an error`, async () => {
			const chapterKey = 'chapterKey', sceneKey = 'sceneKey',
				scene = new Fakes.Scene(), beat = new Fakes.SimpleBeat({ key: 'key', saveData });
			const startResponse = { result: 'result', saveData: saveData };
			const engine = await _createEngine();
			const chapter = new Fakes.Chapter();
			chapter.start.mockReturnValue(sceneKey);
			scene.start.mockReturnValue(beat);
			beat.play.mockReturnValueOnce(startResponse);
			chapterFinderFake.byKey.mockReturnValue(chapter);
			sceneFinderFake.byKey.mockReturnValue(scene);
			await engine.startChapter({ chapterKey });

			await expect(async () => {
				await engine.startChapter({ chapterKey });
			}).rejects.toThrow(Error.NO_RESTART);
		});
	});
});
