import { Scene } from '../../../../../src/Scene/Scene';
import { Fakes } from '../../../fakes/index';

describe(`Scene.next`, () => {
	it(`plays the next beat`, () => {
		const firstBeatKey = 'firstBeat';
		const secondBeatKey = 'secondBeat';
		const firstBeat = new Fakes.SimpleBeat({ key: 'key' });
		const secondBeat = new Fakes.SimpleBeat({ key: 'key' });
		const scene = new Scene({
			beats: {
				[firstBeatKey]: firstBeat,
				[secondBeatKey]: secondBeat,
			},
			firstBeatKey,
			name: 'Scene Name',
			key: 'sceneKey',
			locked: false,
		});
		expect(scene.next(secondBeatKey)).toEqual(secondBeat);
	});
});
