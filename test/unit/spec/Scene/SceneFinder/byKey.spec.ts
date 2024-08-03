import { Scene } from '../../../../../src/Scene/Scene';
import { SceneFinder } from '../../../../../src/Scene/SceneFinder';
import { SceneData } from '../../../../fake-data/TestData';

describe(`SceneFinder.byKey`, () => {
	describe(`loading a valid scene`, () => {
		it(`loads Scene from data`, async () => {
			const sceneKey = 'sceneKey';
			const sceneFinder = new SceneFinder({
				findData: () => Promise.resolve(SceneData),
			});
			const scene = await sceneFinder.byKey(sceneKey);
			expect(scene instanceof Scene).toBe(true);
		});
	});
	describe(`failed to load scene`, () => {
		it(`returns nothing`, async () => {
			const sceneKey = 'sceneKey';
			const sceneFinder = new SceneFinder({
				findData: () => Promise.resolve([]),
			});
			const scene = await sceneFinder.byKey(sceneKey);
			expect(scene).toBe(undefined);
		});
	});
});
