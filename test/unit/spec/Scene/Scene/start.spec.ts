import { Scene } from '../../../../../src/Scene/Scene';
import { Fakes } from '../../../fakes/index';

describe(`Scene.start`, () => {
	it(`plays the current beat`, () => {
		const firstBeatKey = 'firstBeat';
		const firstBeat = new Fakes.SimpleBeat({});
		const beatResponse = { text: 'test', nextBeat: 'secondBeat' };
		firstBeat.play.mockReturnValueOnce(beatResponse);
		const scene = new Scene({
			beats: { [firstBeatKey]: firstBeat },
			firstBeatKey,
			name: 'Scene Name',
			key: 'sceneKey',
			locked: false,
		});
		expect(scene.start()).toEqual(beatResponse);
	});
});
