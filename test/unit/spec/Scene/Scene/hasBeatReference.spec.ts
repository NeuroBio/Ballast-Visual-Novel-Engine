import { BestFitBranchBeat } from '../../../../../src/Beat/BestFitBranchBeat';
import { ChoiceBeat } from '../../../../../src/Beat/ChoiceBeat';
import { FirstFitBranchBeat } from '../../../../../src/Beat/FirstFitBranchBeat';
import { MultiResponseBeat } from '../../../../../src/Beat/MultiResponseBeat';
import { SimpleBeat } from '../../../../../src/Beat/SimpleBeat';
import { Scene } from '../../../../../src/Scene/Scene';
import { Fakes } from '../../../fakes/index';

describe(`Scene.hasBeatReference`, () => {
	const sceneData = Object.freeze({
		setBackground: '',
		updateCharacterSprites: [],
		moveCharacters: [],
		removeCharacters: [],
		addCharacters: [],
	});
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
	describe(`beat exists in beat keys`, () => {
		it(`returns true`, () => {
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

			expect(scene.hasBeatReference()).toBe(true);
		});
	});
	describe(`beat does not exist in beat keys but is referenced by any beat in its default behavior`, () => {
		it(`returns true`, () => {
			const firstBeatKey = 'firstBeat';
			const noBeat = 'undefined';
			const firstBeat = new SimpleBeat({
				key: 'key',
				defaultBehavior: { nextBeat: noBeat, text: 'lol', sceneData },
				saveData,
			});
			const scene = new Scene({
				beats: {
					[firstBeatKey]: firstBeat,
				},
				firstBeatKey: noBeat,
				name: 'Scene Name',
				key: 'sceneKey',
			});
			scene.start();

			expect(scene.hasBeatReference()).toBe(true);
		});
	});
	describe(`beat does not exist in beat keys but is referenced by a first fit beat in its branch behavior`, () => {
		it(`returns true`, () => {
			const firstBeatKey = 'firstBeat';
			const noBeat = 'undefined';
			const firstBeat = new FirstFitBranchBeat({
				key: 'key',
				branches: [
					{ beat: { nextBeat: noBeat, text: 'this', sceneData }, conditions: [() => true] },
					{ beat: { nextBeat: 'nah', text: 'this', sceneData }, conditions: [() => true] },
				],
				defaultBehavior: { nextBeat: 'nah', text: 'lol', sceneData },
				saveData,
			});
			const scene = new Scene({
				beats: {
					[firstBeatKey]: firstBeat,
				},
				firstBeatKey: noBeat,
				name: 'Scene Name',
				key: 'sceneKey',
			});
			scene.start();

			expect(scene.hasBeatReference()).toBe(true);
		});
	});
	describe(`beat does not exist in beat keys but is referenced by a best fit beat in its branch behavior`, () => {
		it(`returns true`, () => {
			const firstBeatKey = 'firstBeat';
			const noBeat = 'undefined';
			const firstBeat = new BestFitBranchBeat({
				key: 'key',
				branches: [
					{ beat: { nextBeat: noBeat, text: 'this', character: '1', sceneData }, conditions: [] },
					{ beat: { nextBeat: 'nah', text: 'this', character: '2', sceneData }, conditions: [] },
				],
				crossBranchCondition: () => '',
				saveData,
			});
			const scene = new Scene({
				beats: {
					[firstBeatKey]: firstBeat,
				},
				firstBeatKey: noBeat,
				name: 'Scene Name',
				key: 'sceneKey',
			});
			scene.start();

			expect(scene.hasBeatReference()).toBe(true);
		});
	});
	describe(`beat does not exist in beat keys but is referenced by a multi-response beat in its responses`, () => {
		it(`returns true`, () => {
			const firstBeatKey = 'firstBeat';
			const noBeat = 'undefined';
			const firstBeat = new MultiResponseBeat({
				key: 'key',
				responses: [
					{ beat: { nextBeat: noBeat, text: 'this', sceneData }, conditions: [] },
					{ beat: { nextBeat: 'nah', text: 'this', sceneData }, conditions: [] },
				],
				defaultBehavior: { nextBeat: 'nah', text: 'lol', sceneData },
				saveData,
			});
			const scene = new Scene({
				beats: {
					[firstBeatKey]: firstBeat,
				},
				firstBeatKey: noBeat,
				name: 'Scene Name',
				key: 'sceneKey',
			});
			scene.start();

			expect(scene.hasBeatReference()).toBe(true);
		});
	});
	describe(`beat does not exist in beat keys but is referenced by a choice beat in its choices`, () => {
		it(`returns true`, () => {
			const firstBeatKey = 'firstBeat';
			const noBeat = 'undefined';
			const firstBeat = new ChoiceBeat({
				key: 'key',
				choices: [
					{ beat: { nextBeat: noBeat, text: 'this', mayPlay: false }, conditions: [] },
					{ beat: { nextBeat: 'nah', text: 'this', mayPlay: false }, conditions: [] },
				],
				saveData,
			});
			const scene = new Scene({
				beats: {
					[firstBeatKey]: firstBeat,
				},
				firstBeatKey: noBeat,
				name: 'Scene Name',
				key: 'sceneKey',
			});
			scene.start();

			expect(scene.hasBeatReference()).toBe(true);
		});
	});
	describe(`beat does not exist in beat keys and is not referenced`, () => {
		it(`returns false`, () => {
			const firstBeatKey = 'firstBeat';
			const noBeat = 'nonsense';
			const firstBeat = new SimpleBeat({
				key: 'key',
				defaultBehavior: { nextBeat: 'nah', text: 'lol', sceneData },
				saveData,
			});
			const scene = new Scene({
				beats: {
					[firstBeatKey]: firstBeat,
				},
				firstBeatKey: noBeat,
				name: 'Scene Name',
				key: 'sceneKey',
			});
			scene.start();

			expect(scene.hasBeatReference()).toBe(false);
		});
	});
});