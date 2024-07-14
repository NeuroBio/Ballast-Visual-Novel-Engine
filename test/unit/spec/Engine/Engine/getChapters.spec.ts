import { Engine } from '../../../../../src/Engine/Engine';
import { ChapterData, CharacterData, SavedDataData, SceneData } from '../../../FakeData/TestData';
import { Chapter } from '../../../fakes/Chapter';
import { Fakes } from '../../../fakes/index';
import { SavedData } from '../../../fakes/SavedData';

describe(`Engine.getChapters`, () => {
	let chapterFinderFake: any, sceneFinderFake: any, savedDataRepoFake: any,
		characterTemplateFinderFake: any, savedData: SavedData;
	function _createEngine (): Engine {
		chapterFinderFake = new Fakes.ChapterFinder();
		sceneFinderFake = new Fakes.SceneFinder();
		savedDataRepoFake = new Fakes.SavedDataRepo();
		savedData = new Fakes.SavedData();
		savedDataRepoFake.findOrCreate.mockReturnValueOnce(savedData);
		characterTemplateFinderFake = new Fakes.CharacterTemplateFinder();
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

	describe(`requesting all chapters`, () => {
		const chapterResponse = ChapterData.map((dto) => new Chapter(dto));
		let response: any;
		beforeAll(async () => {
			const engine = _createEngine();
			chapterFinderFake.all.mockReturnValueOnce(chapterResponse);

			response = await engine.getChapters();
		});
		it(`loads saved data on all chapters`, () => {
			chapterResponse.forEach((chapter) => {
				expect(chapter.reload).toHaveBeenCalled();
			});
		});
		it(`returns all chapters`, () => {
			expect(response).toEqual(chapterResponse);
		});
	});
	describe(`requesting only locked chapters`, () => {
		const chapterResponse = ChapterData.map((dto) => new Chapter(dto));
		let response: any;
		beforeAll(async () => {
			const engine = _createEngine();
			chapterFinderFake.all.mockReturnValueOnce(chapterResponse);

			response = await engine.getChapters({ excludeUnlocked: true });
		});
		it(`loads saved data on all chapters`, () => {
			chapterResponse.forEach((chapter) => {
				expect(chapter.reload).toHaveBeenCalled();
			});
		});
		it(`returns all locked chapters`, () => {
			const lockedChapters = chapterResponse.filter((chap) => chap.isLocked);
			expect(response).toEqual(lockedChapters);
		});
	});
	describe(`requesting only unlocked chapters`, () => {
		const chapterResponse = ChapterData.map((dto) => new Chapter(dto));
		let response: any;
		beforeAll(async () => {
			const engine = _createEngine();
			chapterFinderFake.all.mockReturnValueOnce(chapterResponse);

			response = await engine.getChapters({ excludeLocked: true });
		});
		it(`loads saved data on all chapters`, () => {
			chapterResponse.forEach((chapter) => {
				expect(chapter.reload).toHaveBeenCalled();
			});
		});
		it(`returns all unlocked chapters`, () => {
			const unlockedChapters = chapterResponse.filter((chap) => !chap.isLocked);
			expect(response).toEqual(unlockedChapters);
		});
	});
});
