import { SaveDataSideEffects } from '../../../../../src/Beat/Beat';
import { DisplaySideEffects } from '../../../../../src/Beat/SharedInterfaces';
import { SimpleBeat } from '../../../../../src/Beat/SimpleBeat';
import { FinalBeat } from '../../../../../src/Beat/FinalBeat';
import { Scene } from '../../../../../src/Scene/Scene';

describe(`Scene.rollBack`, () => {
	const sceneData: DisplaySideEffects = Object.freeze({
		setBackground: '',
		updateCharacterSprites: [],
		moveCharacters: [],
		removeCharacters: [],
		addCharacters: [],
	});
	const saveData: SaveDataSideEffects = Object.freeze({
		queuedScenes: [],
		unlockedChapters: [],
		unlockedAchievements: [],
		addedItems: [],
		removedItems: [],
		addedMemories: [],
		removedMemories: [],
		updatedCharacterTraits: [],
	});
	const simpleBeat = {
		key: '1',
		defaultBehavior: {
			text: '1',
			nextBeat: '2',
			sceneData,
		},
		saveData,
	};
	const finalBeat = {
		key: '2',
		defaultBehavior: {
			text: '2',
			sceneData,
		},
		saveData,
	};
	const beats = {
		[simpleBeat.key]: new SimpleBeat(simpleBeat),
		[finalBeat.key]: new FinalBeat(finalBeat),
	};

	describe(`scene has no prior beat`, () => {
		it(`does nothing`, () => {
			const scene = new Scene({
				name: 'leScene',
				key: 'ls',
				firstBeatKey: simpleBeat.key,
				beats,
			});

			scene.start();
			expect(scene.isComplete).toBe(false);

			scene.next(finalBeat.key);
			expect(scene.isComplete).toBe(true);

			scene.next('');
			expect(scene.isComplete).toBe(false);

			scene.rollBack();
			expect(scene.isComplete).toBe(true);
		});
	});
	describe(`scene has a prior beat`, () => {
		it(`rolls back to the prior beat`, () => {
			const scene = new Scene({
				name: 'leScene',
				key: 'ls',
				firstBeatKey: simpleBeat.key,
				beats,
			});

			scene.start();
			expect(scene.isComplete).toBe(false);

			scene.next(finalBeat.key);
			expect(scene.isComplete).toBe(true);

			scene.rollBack();
			expect(scene.isComplete).toBe(false);
		});
	});
});