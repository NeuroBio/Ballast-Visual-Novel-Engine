import { BeatFinder } from '../../../../../src/Beat/BeatFinder';

describe(`BeatFinder.byKey`, () => {
	const KEY = 'firstBeat';

	it(`loads beat from data`, () => {
		const beatFinder = new BeatFinder();
		const beat = beatFinder.byKey(KEY);
		expect(Object.getPrototypeOf(beat.constructor).name).toBe('Beat');
	});
});
