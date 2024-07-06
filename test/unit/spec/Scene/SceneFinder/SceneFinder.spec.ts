import { Scene } from '../../../../../src/Scene/Scene';
import { SceneFinder } from '../../../../../src/Scene/SceneFinder';

describe(`SceneFinder.byKey`, () => {
	const KEY = 'sceneKey';

	it(`loads Scene from data`, () => {
		const sceneFinder = new SceneFinder();
		const scene = sceneFinder.byKey(KEY);
		expect(scene instanceof Scene).toBe(true);
	});
});
