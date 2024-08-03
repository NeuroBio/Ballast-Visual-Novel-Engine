import { Engine } from '../../../../../src/Engine/Engine';
import { ChapterData, CharacterData, SavedDataData, SceneData } from '../../../../fake-data/TestData';
import { Scene } from '../../../fakes/Scene';
import { Fakes } from '../../../fakes/index';

describe(`Engine.save`, () => {
	const Error = Object.freeze({
		TOO_EARLY: 'You cannot save data prior to loading save data.',
	});
	let chapterFinderFake: any, sceneFinderFake: any, scene: Scene, savedDataRepoFake: any,
		characterTemplateFinderFake: any;
	async function _createEngine (): Promise<Engine> {
		chapterFinderFake = new Fakes.ChapterFinder();
		sceneFinderFake = new Fakes.SceneFinder();
		savedDataRepoFake = new Fakes.SavedDataRepo();
		const chapter = new Fakes.Chapter();
		scene = new Fakes.Scene();
		chapterFinderFake.byKey.mockReturnValueOnce(chapter);
		sceneFinderFake.byKey.mockReturnValueOnce(scene);
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
	describe(`called before data loaded`, () => {
		it(`throws error`, async () => {
			const engine = await _createEngine();
			await expect(async () => {
				await engine.save();
			}).rejects.toThrow(Error.TOO_EARLY);
		});
	});
	describe(`called while saved data is loaded`, () => {
		it(`saves the data`, async () => {
			const engine = await _createEngine();
			await engine.loadSavedData();
			await engine.save();
			expect(savedDataRepoFake.save).toHaveBeenCalled();
		});
	});
});