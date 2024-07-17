import { FinalBeat } from '../../../../../src/Beat/FinalBeat';
import { Scene } from '../../../../../src/Scene/Scene';
import { Fakes } from '../../../fakes/index';

describe(`Scene.isComplete`, () => {
	describe(`current beat is not a final beat`, () => {
		it(`returns false`, () => {
			const firstBeatKey = 'firstBeat';
			const firstBeat = new Fakes.SimpleBeat({ key: 'key' });
			const scene = new Scene({
				beats: {
					[firstBeatKey]: firstBeat,
				},
				firstBeatKey,
				name: 'Scene Name',
				key: 'sceneKey',
				locked: false,
			});
			scene.start();

			expect(scene.isComplete).toBe(false);
		});
	});
	describe(`current beat is a final beat`, () => {
		it(`returns true`, () => {
			const firstBeatKey = 'firstBeat';
			const firstBeat = new FinalBeat({ key: 'key', text: 'real-ish' });
			const scene = new Scene({
				beats: {
					[firstBeatKey]: firstBeat,
				},
				firstBeatKey,
				name: 'Scene Name',
				key: 'sceneKey',
				locked: false,
			});
			scene.start();

			expect(scene.isComplete).toBe(true);
		});
	});
});
