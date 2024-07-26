import { NARRATOR } from '../../../../../src/Beat/Beat';
import { BestFitBranchBeat } from '../../../../../src/Beat/BestFitBranchBeat';

describe(`BestFitBranchBeat.play`, () => {
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
	describe(`
		three branches are unconditional
		there are no repeated characters
		`, () => {
		it(`returns the beat for the requested character`, () => {
			const beat = new BestFitBranchBeat({
				key: '',
				crossBranchCondition: () => 'char2',
				branches: [
					{ beat: { nextBeat: 'beat1', character: 'char1', text: 'text1', sceneData }, conditions: [] },
					{ beat: { nextBeat: 'beat2', character: 'char2', text: 'text2', sceneData }, conditions: [] },
					{ beat: { nextBeat: 'beat3', character: 'char3', text: 'text3', sceneData }, conditions: [] },
				],
				saveData,
			});
			expect(beat.play({
				characters: {},
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: `text2`,
				nextBeat: 'beat2',
				speaker: NARRATOR,
				saveData: expect.any(Object),
				sceneData: expect.any(Object),
			});
		});
	});
	describe(`
		three branches are unconditional
		there are repeated characters
		`, () => {
		it(`returns the beat for the requested character`, () => {
			const beat = new BestFitBranchBeat({
				key: '',
				crossBranchCondition: () => 'char1',
				branches: [
					{ beat: { nextBeat: 'beat1', character: 'char1', text: 'text1', sceneData }, conditions: [] },
					{ beat: { nextBeat: 'beat2', character: 'char2', text: 'text2', sceneData }, conditions: [] },
					{ beat: { nextBeat: 'beat3', character: 'char1', text: 'text3', sceneData }, conditions: [] },
				],
				saveData,
			});
			expect(beat.play({
				characters: {},
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: `text1`,
				nextBeat: 'beat1',
				speaker: NARRATOR,
				saveData: expect.any(Object),
				sceneData: expect.any(Object),
			});
		});
	});
	describe(`
		three branches are conditional
		all conditions are met
		there are no repeated characters
		`, () => {
		it(`returns the beat for the requested character`, () => {
			const beat = new BestFitBranchBeat({
				key: '',
				crossBranchCondition: () => 'char2',
				branches: [
					{ beat: { nextBeat: 'beat1', character: 'char1', text: 'text1', sceneData }, conditions: [() => true] },
					{ beat: { nextBeat: 'beat2', character: 'char2', text: 'text2', sceneData }, conditions: [() => true] },
					{ beat: { nextBeat: 'beat3', character: 'char3', text: 'text3', sceneData }, conditions: [() => true] },
				],
				defaultBehavior: { nextBeat: 'defaultBeat', text: 'default', sceneData },
				saveData,
			});
			expect(beat.play({
				characters: {},
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: `text2`,
				nextBeat: 'beat2',
				speaker: NARRATOR,
				saveData: expect.any(Object),
				sceneData: expect.any(Object),
			});
		});
	});
	describe(`
		three branches are conditional
		all conditions are met
		there are repeated characters
		`, () => {
		it(`returns the beat for the requested character`, () => {
			const beat = new BestFitBranchBeat({
				key: '',
				crossBranchCondition: () => 'char1',
				branches: [
					{ beat: { nextBeat: 'beat1', character: 'char1', text: 'text1', sceneData }, conditions: [() => true] },
					{ beat: { nextBeat: 'beat2', character: 'char2', text: 'text2', sceneData }, conditions: [() => true] },
					{ beat: { nextBeat: 'beat3', character: 'char1', text: 'text3', sceneData }, conditions: [() => true] },
				],
				defaultBehavior: { nextBeat: 'defaultBeat', text: 'default', sceneData },
				saveData,
			});
			expect(beat.play({
				characters: {},
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: `text1`,
				nextBeat: 'beat1',
				speaker: NARRATOR,
				saveData: expect.any(Object),
				sceneData: expect.any(Object),
			});
		});
	});
	describe(`
		three branches are conditional
		one condition is met
		there are repeated characters
		`, () => {
		it(`returns the beat for the default behavior`, () => {
			const beat = new BestFitBranchBeat({
				key: '',
				crossBranchCondition: () => 'char1',
				branches: [
					{ beat: { nextBeat: 'beat1', character: 'char1', text: 'text1', sceneData }, conditions: [() => false] },
					{ beat: { nextBeat: 'beat2', character: 'char2', text: 'text2', sceneData }, conditions: [() => false] },
					{ beat: { nextBeat: 'beat3', character: 'char3', text: 'text3', sceneData }, conditions: [() => true] },
				],
				defaultBehavior: { nextBeat: 'defaultBeat', text: 'default', sceneData },
				saveData,
			});
			expect(beat.play({
				characters: {},
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: `text3`,
				nextBeat: 'beat3',
				speaker: NARRATOR,
				saveData: expect.any(Object),
				sceneData: expect.any(Object),
			});
		});
	});
	describe(`
		three branches are conditional
		no conditions are met
		there are repeated characters
		`, () => {
		it(`returns the beat for the default behavior`, () => {
			const beat = new BestFitBranchBeat({
				key: '',
				crossBranchCondition: () => 'char1',
				branches: [
					{ beat: { nextBeat: 'beat1', character: 'char1', text: 'text1', sceneData }, conditions: [() => false] },
					{ beat: { nextBeat: 'beat2', character: 'char2', text: 'text2', sceneData }, conditions: [() => false] },
					{ beat: { nextBeat: 'beat3', character: 'char3', text: 'text3', sceneData }, conditions: [() => false] },
				],
				defaultBehavior: { nextBeat: 'defaultBeat', text: 'default', sceneData },
				saveData,
			});
			expect(beat.play({
				characters: {},
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: `default`,
				nextBeat: 'defaultBeat',
				speaker: NARRATOR,
				saveData: expect.any(Object),
				sceneData: expect.any(Object),
			});
		});
	});
});