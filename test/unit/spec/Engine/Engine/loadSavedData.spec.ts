import { Engine } from '../../../../../src/Engine/Engine';
import { ChapterData, CharacterData, CharacterTemplateData, SavedDataData, SceneData } from '../../../FakeData/TestData';
import { Fakes } from '../../../fakes/index';
import { SavedData } from '../../../fakes/SavedData';

describe(`Engine.loaSavedData`, () => {
	let chapterFinderFake: any, sceneFinderFake: any, savedDataRepoFake: any,
		characterTemplateFinderFake: any, savedData: SavedData;
	function _createEngine (): Engine {
		chapterFinderFake = new Fakes.ChapterFinder();
		sceneFinderFake = new Fakes.SceneFinder();
		savedDataRepoFake = new Fakes.SavedDataRepo();
		savedData = new Fakes.SavedData();
		savedDataRepoFake.findOrCreate.mockReturnValueOnce(savedData);
		characterTemplateFinderFake = new Fakes.CharacterTemplateFinder();
		characterTemplateFinderFake.all.mockReturnValueOnce(CharacterTemplateData);
		return new Engine({
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
	}
	beforeAll(async () => {
		const engine = _createEngine();
		await engine.loadSavedData();
	});
	it(`loads the saved data`, async () => {
		expect(savedDataRepoFake.findOrCreate).toHaveBeenCalled();
	});
	it(`loads character templates`, async () => {
		expect(characterTemplateFinderFake.all).toHaveBeenCalled();
	});
	it(`updates save data with missing character templates`, () => {
		expect(savedData.addMissingCharacters).toHaveBeenCalledWith(CharacterTemplateData);
	});
	it(`creates a clone for modification`, () => {
		expect(savedData.clone).toHaveBeenCalled();
	});
});
