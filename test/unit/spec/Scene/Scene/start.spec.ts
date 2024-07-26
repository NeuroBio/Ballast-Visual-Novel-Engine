import { Scene } from '../../../../../src/Scene/Scene';
import { Fakes } from '../../../fakes/index';

describe(`Scene.start`, () => {
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
	it(`plays the current beat`, () => {
		const firstBeatKey = 'firstBeat';
		const firstBeat = new Fakes.SimpleBeat({ key: 'key', saveData });
		const scene = new Scene({
			beats: { [firstBeatKey]: firstBeat },
			firstBeatKey,
			name: 'Scene Name',
			key: 'sceneKey',
		});
		expect(scene.start()).toEqual(firstBeat);
	});
});
