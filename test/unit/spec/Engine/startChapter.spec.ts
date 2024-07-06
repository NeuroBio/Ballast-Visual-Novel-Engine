import { Engine } from '../../../../src/Engine/Engine';
import { Fakes } from '../../fakes/index';

describe(`Engine.startChapter`, () => {
	let chapterFinderFake: any, sceneFinderFake: any;
	function _createEngine (): Engine {
		chapterFinderFake = new Fakes.ChapterFinder();
		sceneFinderFake = new Fakes.SceneFinder();
		return new Engine({
			chapterFinder: chapterFinderFake,
			sceneFinder: sceneFinderFake,
		});
	}
	describe(`loading chapter for the first time`, () => {
		const chapterKey = 'chapterKey',
			sceneKey = 'sceneKey';
		beforeAll(() => {
			const chapterFinder = _createEngine();
			const chapter = new Fakes.Chapter();
			chapter.start.mockReturnValueOnce(sceneKey);
			chapterFinderFake.byKey.mockReturnValueOnce(chapter);
			chapterFinder.startChapter({ chapterKey });
		});
		it(`calls chapterFinder with correct key`, () => {
			expect(chapterFinderFake.byKey).toHaveBeenCalledWith(chapterKey);
		});
		it(`calls sceneFinder with correct key`, () => {
			expect(sceneFinderFake.byKey).toHaveBeenCalledWith(sceneKey);
		});
	});
});
