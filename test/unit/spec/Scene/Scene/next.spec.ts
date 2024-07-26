import { Scene } from '../../../../../src/Scene/Scene';
import { Fakes } from '../../../fakes/index';

describe(`Scene.next`, () => {
	const saveData = Object.freeze({
		queuedScenes: [],
		unlockedChapters: [],
		unlockedAchievements: [],
		addedItems: [],
		removedItems: [],
		addedMemories: [],
		removedMemories: [],
		updatedCharacterTraits: [],
	});
	it(`plays the next beat`, () => {
		const firstBeatKey = 'firstBeat';
		const secondBeatKey = 'secondBeat';
		const firstBeat = new Fakes.SimpleBeat({ key: 'key', saveData });
		const secondBeat = new Fakes.SimpleBeat({ key: 'key', saveData });
		const scene = new Scene({
			beats: {
				[firstBeatKey]: firstBeat,
				[secondBeatKey]: secondBeat,
			},
			firstBeatKey,
			name: 'Scene Name',
			key: 'sceneKey',
		});
		expect(scene.next(secondBeatKey)).toEqual(secondBeat);
	});
});
