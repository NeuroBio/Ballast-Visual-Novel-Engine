import { NARRATOR } from '../../../../../src/Beat/Beat';
import { BestFitBranchBeat } from '../../../../../src/Beat/BestFitBranchBeat';

describe(`BestFitBranchBeat.play`, () => {
	describe(`
		three branches are nonconditional
		there are no repeated characters
		`, () => {
		it(`returns the beat for the requested character`, () => {
			const beat = new BestFitBranchBeat({
				key: '',
				crossBranchCondition: () => 'char2',
				branches: [
					{ beat: { nextBeat: 'beat1', character: 'char1', text: 'text1' }, conditions: [] },
					{ beat: { nextBeat: 'beat2', character: 'char2', text: 'text2' }, conditions: [] },
					{ beat: { nextBeat: 'beat3', character: 'char3', text: 'text3' }, conditions: [] },
				],
			});
			expect(beat.play({
				characters: {},
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: `text2`,
				nextBeat: 'beat2',
				speaker: NARRATOR,
			});
		});
	});
	describe(`
		three branches are nonconditional
		there are repeated characters
		`, () => {
		it(`returns the beat for the requested character`, () => {
			const beat = new BestFitBranchBeat({
				key: '',
				crossBranchCondition: () => 'char1',
				branches: [
					{ beat: { nextBeat: 'beat1', character: 'char1', text: 'text1' }, conditions: [] },
					{ beat: { nextBeat: 'beat2', character: 'char2', text: 'text2' }, conditions: [] },
					{ beat: { nextBeat: 'beat3', character: 'char1', text: 'text3' }, conditions: [] },
				],
			});
			expect(beat.play({
				characters: {},
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: `text1`,
				nextBeat: 'beat1',
				speaker: NARRATOR,
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
					{ beat: { nextBeat: 'beat1', character: 'char1', text: 'text1' }, conditions: [() => true] },
					{ beat: { nextBeat: 'beat2', character: 'char2', text: 'text2' }, conditions: [() => true] },
					{ beat: { nextBeat: 'beat3', character: 'char3', text: 'text3' }, conditions: [() => true] },
				],
				defaultBehavior: { nextBeat: 'defaultBeat', text: 'default' },
			});
			expect(beat.play({
				characters: {},
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: `text2`,
				nextBeat: 'beat2',
				speaker: NARRATOR,
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
					{ beat: { nextBeat: 'beat1', character: 'char1', text: 'text1' }, conditions: [() => true] },
					{ beat: { nextBeat: 'beat2', character: 'char2', text: 'text2' }, conditions: [() => true] },
					{ beat: { nextBeat: 'beat3', character: 'char1', text: 'text3' }, conditions: [() => true] },
				],
				defaultBehavior: { nextBeat: 'defaultBeat', text: 'default' },
			});
			expect(beat.play({
				characters: {},
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: `text1`,
				nextBeat: 'beat1',
				speaker: NARRATOR,
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
					{ beat: { nextBeat: 'beat1', character: 'char1', text: 'text1' }, conditions: [() => false] },
					{ beat: { nextBeat: 'beat2', character: 'char2', text: 'text2' }, conditions: [() => false] },
					{ beat: { nextBeat: 'beat3', character: 'char3', text: 'text3' }, conditions: [() => true] },
				],
				defaultBehavior: { nextBeat: 'defaultBeat', text: 'default' },
			});
			expect(beat.play({
				characters: {},
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: `text3`,
				nextBeat: 'beat3',
				speaker: NARRATOR,
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
					{ beat: { nextBeat: 'beat1', character: 'char1', text: 'text1' }, conditions: [() => false] },
					{ beat: { nextBeat: 'beat2', character: 'char2', text: 'text2' }, conditions: [() => false] },
					{ beat: { nextBeat: 'beat3', character: 'char3', text: 'text3' }, conditions: [() => false] },
				],
				defaultBehavior: { nextBeat: 'defaultBeat', text: 'default' },
			});
			expect(beat.play({
				characters: {},
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: `default`,
				nextBeat: 'defaultBeat',
				speaker: NARRATOR,
			});
		});
	});
});