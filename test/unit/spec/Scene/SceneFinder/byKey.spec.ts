import { Scene } from '../../../../../src/Scene/Scene';
import { SceneFinder } from '../../../../../src/Scene/SceneFinder';
import { SceneData } from '../../../FakeData/TestData';

describe(`SceneFinder.byKey`, () => {
	const Error = Object.freeze({
		NOT_FOUND: 'Requested scene was not found.',
	});

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
	describe(`Scene is not found`, () => {
		it(`throws an error`, async () => {
			const sceneKey = 'missingSceneKey';
			const sceneFinder = new SceneFinder({
				findData: () => Promise.resolve([]),
			});
			await expect(async () => {
				await sceneFinder.byKey(sceneKey);
			}).rejects.toThrow(Error.NOT_FOUND);
		});
	});
});
