import { Engine } from '../../../../../src/Engine/Engine';
import { ChapterData, SavedDataData, SceneData } from '../../../FakeData/TestData';
import { Chapter } from '../../../fakes/Chapter';
import { Fakes } from '../../../fakes/index';

describe(`Engine.getChapters`, () => {
	let chapterFinderFake: any, sceneFinderFake: any, savedDataRepoFake: any;
	function _createEngine (): Engine {
		chapterFinderFake = new Fakes.ChapterFinder();
		sceneFinderFake = new Fakes.SceneFinder();
		savedDataRepoFake = new Fakes.SavedDataRepo();
		return new Engine({
			findChapterData: () => Promise.resolve(ChapterData),
			findSceneData: () => Promise.resolve(SceneData),
			findSavedData: () => Promise.resolve(SavedDataData),
			saveSavedData: () => Promise.resolve(),
			chapterFinder: chapterFinderFake,
			sceneFinder: sceneFinderFake,
			savedDataRepo: savedDataRepoFake,
		});
	}

	describe(`requesting all chapters`, () => {
		it(`returns all chapters`, async () => {
			const engine = _createEngine();
			const chapterResponse = ChapterData.map((dto) => new Chapter(dto));
			chapterFinderFake.all.mockReturnValueOnce(chapterResponse);

			const chapters = await engine.getChapters();
			expect(chapters).toEqual(chapterResponse);
		});
	});
	describe(`requesting only locked chapters`, () => {
		it(`returns all locked chapters`, async () => {
			const engine = _createEngine();
			const chapterResponse = ChapterData.map((dto) => {
				const chapter = new Chapter(dto);
				chapter.isLocked.mockReturnValue(dto.locked);
				return chapter;
			});
			chapterFinderFake.all.mockReturnValueOnce(chapterResponse);

			const chapters = await engine.getChapters({ excludeUnlocked: true });
			const lockedChapters = chapterResponse.filter((chap) => chap.isLocked() === true);
			expect(chapters).toEqual(lockedChapters);
		});
	});
	describe(`requesting only unlocked chapters`, () => {
		it(`returns all locked chapters`, async () => {
			const engine = _createEngine();
			const chapterResponse = ChapterData.map((dto) => {
				const chapter = new Chapter(dto);
				chapter.isLocked.mockReturnValue(dto.locked);
				return chapter;
			});
			chapterFinderFake.all.mockReturnValueOnce(chapterResponse);

			const chapters = await engine.getChapters({ excludeLocked: true });
			const unlockedChapters = chapterResponse.filter((chap) => chap.isLocked() === false);
			expect(chapters).toEqual(unlockedChapters);
		});
	});
});
