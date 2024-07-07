import { Engine } from '../../../../../src/Engine/Engine';
import { ChapterData } from '../../../FakeData/TestData';
import { Fakes } from '../../../fakes/index';
import { Scene } from '../../../fakes/Scene';

describe(`Engine.advanceScene`, () => {
	let chapterFinderFake: any, sceneFinderFake: any, scene: Scene;
	function _createEngine (): Engine {
		chapterFinderFake = new Fakes.ChapterFinder();
		sceneFinderFake = new Fakes.SceneFinder();
		const chapter = new Fakes.Chapter();
		scene = new Fakes.Scene();
		chapterFinderFake.byKey.mockReturnValueOnce(chapter);
		sceneFinderFake.byKey.mockReturnValueOnce(scene);
		const engine = new Engine({
			chapterDataFetcher: () => ChapterData,
			chapterFinder: chapterFinderFake,
			sceneFinder: sceneFinderFake,
		});
		engine.startChapter({ chapterKey: '' });
		return engine;
	}
	describe(`playing a beat with a next beat`, () => {
		const beatKey = 'beatKey', playResponse = { result: 'result' };
		let result: any;

		beforeAll(() => {
			const engine = _createEngine();
			scene.next.mockReturnValueOnce(playResponse);
			result = engine.advanceScene({ beatKey });
		});
		it(`plays the scene's next beat`, () => {
			expect(scene.next).toHaveBeenCalled();
		});
		it(`returns the beat data for display`, () => {
			expect(result).toEqual(playResponse);
		});
	});
});
