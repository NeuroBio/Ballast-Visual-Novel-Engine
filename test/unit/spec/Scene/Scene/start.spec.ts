import { Scene } from '../../../../../src/Scene/Scene';
import { Fakes } from '../../../fakes/index';

describe(`Scene.start`, () => {
	it(`returns the current scene`, () => {
		const firstBeatKey = 'firstBeat';
		const firstBeat = new Fakes.SimpleBeat({});
		const beatResponse = { text: 'test', nextBeat: 'secondBeat' };
		firstBeat.play.mockReturnValueOnce(beatResponse);
		const scene = new Scene({
			beats: { [firstBeatKey]: firstBeat },
			firstBeatKey,
			name: 'Scene Name',
			key: 'sceneKey',
		});
		expect(scene.start()).toEqual(beatResponse);
	});
});
