import { Scene } from '../../../../../src/Scene/Scene';
import { Fakes } from '../../../fakes/index';

describe(`Scene.start`, () => {
	it(`plays the current beat`, () => {
		const firstBeatKey = 'firstBeat';
		const firstBeat = new Fakes.SimpleBeat({ key: 'key' });
		const scene = new Scene({
			beats: { [firstBeatKey]: firstBeat },
			firstBeatKey,
			name: 'Scene Name',
			key: 'sceneKey',
			locked: false,
		});
		expect(scene.start()).toEqual(firstBeat);
	});
});
