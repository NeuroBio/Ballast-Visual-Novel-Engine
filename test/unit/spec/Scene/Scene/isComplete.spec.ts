import { FinalBeat } from '../../../../../src/Beat/FinalBeat';
import { Scene } from '../../../../../src/Scene/Scene';
import { Fakes } from '../../../fakes/index';

describe(`Scene.isComplete`, () => {
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
	const sceneData = Object.freeze({
		setBackground: '',
		updateCharacterSprites: [],
		moveCharacters: [],
		removeCharacters: [],
		addCharacters: [],
	});
	describe(`current beat is not a final beat`, () => {
		it(`returns false`, () => {
			const firstBeatKey = 'firstBeat';
			const firstBeat = new Fakes.SimpleBeat({ key: 'key', saveData });
			const scene = new Scene({
				beats: {
					[firstBeatKey]: firstBeat,
				},
				firstBeatKey,
				name: 'Scene Name',
				key: 'sceneKey',
			});
			scene.start();

			expect(scene.isComplete).toBe(false);
		});
	});
	describe(`current beat is a final beat`, () => {
		it(`returns true`, () => {
			const firstBeatKey = 'firstBeat';
			const firstBeat = new FinalBeat({ key: 'key', defaultBehavior: { text: 'real-ish', sceneData }, saveData });
			const scene = new Scene({
				beats: {
					[firstBeatKey]: firstBeat,
				},
				firstBeatKey,
				name: 'Scene Name',
				key: 'sceneKey',
			});
			scene.start();

			expect(scene.isComplete).toBe(true);
		});
	});
});
