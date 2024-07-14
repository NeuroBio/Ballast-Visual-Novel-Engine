import { Engine } from '../../../../../src/Engine/Engine';
import { ChapterData, CharacterData, SavedDataData, SceneData } from '../../../FakeData/TestData';
import { Fakes } from '../../../fakes/index';

describe(`Engine.loaSavedData`, () => {
	let chapterFinderFake: any, sceneFinderFake: any, savedDataRepoFake: any;
	function _createEngine (): Engine {
		chapterFinderFake = new Fakes.ChapterFinder();
		sceneFinderFake = new Fakes.SceneFinder();
		savedDataRepoFake = new Fakes.SavedDataRepo();
		savedDataRepoFake.findOrCreate.mockReturnValueOnce(new Fakes.SavedData());
		return new Engine({
			findChapterData: () => Promise.resolve(ChapterData),
			findSceneData: () => Promise.resolve(SceneData),
			findCharacterData: () => Promise.resolve(CharacterData),
			findSavedData: () => Promise.resolve(SavedDataData),
			saveSavedData: () => Promise.resolve(),
			chapterFinder: chapterFinderFake,
			sceneFinder: sceneFinderFake,
			savedDataRepo: savedDataRepoFake,
		});
	}
	it(`loads the saved data`, async () => {
		const engine = _createEngine();
		await engine.loadSavedData();
		expect(savedDataRepoFake.findOrCreate).toHaveBeenCalled();
	});
});
