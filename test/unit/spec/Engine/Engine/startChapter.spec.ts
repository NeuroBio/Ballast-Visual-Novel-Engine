import { Engine } from '../../../../../src/Engine/Engine';
import { Fakes } from '../../../fakes/index';

describe(`Engine.startChapter`, () => {
	let chapterFinderFake: any, sceneFinderFake: any, beatFinderFake: any;
	function _createEngine (): Engine {
		chapterFinderFake = new Fakes.ChapterFinder();
		sceneFinderFake = new Fakes.SceneFinder();
		beatFinderFake = new Fakes.BeatFinder();
		return new Engine({
			chapterFinder: chapterFinderFake,
			sceneFinder: sceneFinderFake,
			beatFinder: beatFinderFake,
		});
	}
	describe(`loading chapter for the first time`, () => {
		const chapterKey = 'chapterKey', sceneKey = 'sceneKey',
			beatKey = 'beatKey', beat = new Fakes.Beat(),
			playResponse = { result: 'result' };
		let result: any;
		beforeAll(() => {
			const engine = _createEngine();
			const chapter = new Fakes.Chapter();
			chapter.start.mockReturnValueOnce(sceneKey);
			const scene = new Fakes.Scene();
			scene.start.mockReturnValueOnce(beatKey);
			beat.play.mockReturnValueOnce(playResponse);
			chapterFinderFake.byKey.mockReturnValueOnce(chapter);
			sceneFinderFake.byKey.mockReturnValueOnce(scene);
			beatFinderFake.byKey.mockReturnValueOnce(beat);
			result = engine.startChapter({ chapterKey });
		});
		it(`calls chapterFinder with correct key`, () => {
			expect(chapterFinderFake.byKey).toHaveBeenCalledWith(chapterKey);
		});
		it(`calls sceneFinder with correct key`, () => {
			expect(sceneFinderFake.byKey).toHaveBeenCalledWith(sceneKey);
		});
		it(`calls beatFinder with correct key`, () => {
			expect(beatFinderFake.byKey).toHaveBeenCalledWith(beatKey);
		});
		it(`plays the beat`, () => {
			expect(beat.play).toHaveBeenCalled();
		});
		it(`returns the beat data for display`, () => {
			expect(result).toEqual(playResponse);
		});
	});
});
