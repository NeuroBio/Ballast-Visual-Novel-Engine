import { Engine } from '../../../../../src/Engine/Engine';
import { Fakes } from '../../../fakes/index';

describe(`Engine.advanceScene`, () => {
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
	describe(`playing a beat with a next beat`, () => {
		const beatKey = 'beatKey', playResponse = { result: 'result' }, beat = new Fakes.Beat();
		let result: any;

		beforeAll(() => {
			const engine = _createEngine();
			beat.play.mockReturnValueOnce(playResponse);
			beatFinderFake.byKey.mockReturnValueOnce(beat);
			result = engine.advanceScene({ beatKey });
		});
		it(`loads the correct beat`, () => {
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
