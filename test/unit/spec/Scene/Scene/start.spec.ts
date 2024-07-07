import { Scene } from '../../../../../src/Scene/Scene';

describe(`Scene.start`, () => {
	it(`returns the current scene`, () => {
		const firstBeat = 'firstBeat';
		const scene = new Scene({
			beats: [firstBeat],
			firstBeatKey: firstBeat,
			name: 'Scene Name',
			key: 'sceneKey',
		});
		expect(scene.start()).toBe(firstBeat);
	});
});
