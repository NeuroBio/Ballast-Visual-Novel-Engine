import { Scene } from '../../../../../src/Scene/Scene';
import { SceneFinder } from '../../../../../src/Scene/SceneFinder';
import { SceneData } from '../../../FakeData/TestData';

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
});
