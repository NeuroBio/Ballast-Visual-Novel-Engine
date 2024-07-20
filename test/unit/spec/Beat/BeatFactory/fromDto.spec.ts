import { BeatFactory, SingleConditionType, CrossConditionType } from '../../../../../src/Beat/BeatFactory';
import { BestFitBranchBeat } from '../../../../../src/Beat/BestFitBranchBeat';
import { ChoiceBeat } from '../../../../../src/Beat/ChoiceBeat';
import { FinalBeat } from '../../../../../src/Beat/FinalBeat';
import { FirstFitBranchBeat } from '../../../../../src/Beat/FirstFitBranchBeat';
import { MultiResponseBeat } from '../../../../../src/Beat/MultiResponseBeat';
import { SimpleBeat } from '../../../../../src/Beat/SimpleBeat';

describe('BeatFactory.fromDto', () => {
	const Error = Object.freeze({
		NON_BEAT: 'Received malformed beat data for beatKey.  See the documentation for expected shapes for different beat types.',
	});
	describe(`received invalid dto`, () => {
		it(`throws error`, () => {
			const beatFactory = new BeatFactory();
			expect(() => beatFactory.fromDto({ key: 'beatKey' }))
				.toThrow(Error.NON_BEAT);
		});
	});
	describe(`received dto with unconditional choices without a character`, () => {
		it(`returns a Choice Beat`, () => {
			const beatFactory = new BeatFactory();
			const result = beatFactory.fromDto({
				key: 'beatKey',
				choices: [
					{
						text: 'text for this choice',
						nextBeat: 'choice followup beat',
					},
					{
						text: 'text for this other choice',
						nextBeat: 'other choice followup beat',
					},
				],
			});
			expect(result instanceof ChoiceBeat).toBe(true);
		});
	});
	describe(`received dto with all classes of conditional choices an a default behavior`, () => {
		it(`returns a Choice Beat`, () => {
			const beatFactory = new BeatFactory();
			const result = beatFactory.fromDto({
				key: 'beatKey',
				choices: [
					{
						text: 'text 1',
						nextBeat: 'beat 1',
						conditions: [{
							type: SingleConditionType.AT_LEAST_ITEM,
							item: 'itemKey',
							quantity: 3,
						}],
					},
					{
						text: 'text 2',
						nextBeat: 'beat 2',
						conditions: [{
							type: SingleConditionType.AT_MOST_ITEM,
							item: 'itemKey',
							quantity: 3,
						}],
					},
					{
						text: 'text 3',
						nextBeat: 'beat 3',
						conditions: [{
							type: SingleConditionType.AT_MOST_CHAR_TRAIT,
							character: 'character',
							value: 0.3,
							trait: 'a feels',
						}],
					},
					{
						text: 'text 4',
						nextBeat: 'beat 4',
						conditions: [{
							type: SingleConditionType.AT_LEAST_CHAR_TRAIT,
							character: 'character',
							value: 0.3,
							trait: 'a feels',
						}],
					},
					{
						text: 'text 5',
						nextBeat: 'beat 5',
						conditions: [{
							type: SingleConditionType.CHARACTER_AWARE,
							character: 'character',
							memory: 'mem',
						}],
					},
					{
						text: 'text 6',
						nextBeat: 'beat 6',
						conditions: [{
							type: SingleConditionType.CHARACTER_AWARE,
							character: 'character',
							memory: 'mem',
						}],
					},
				],
				defaultBehavior: {
					text: 'default text',
					nextBeat: 'default nextBeat',
					character: 'characterKey',
				},
			});
			expect(result instanceof ChoiceBeat).toBe(true);
		});
	});
	describe(`received dto without choices without a character`, () => {
		it(`returns a Simple Beat`, () => {
			const beatFactory = new BeatFactory();
			const result = beatFactory.fromDto({
				key: 'beatKey',
				defaultBehavior: {
					text: 'test text',
					nextBeat: 'beat key',
				},
			});
			expect(result instanceof SimpleBeat).toBe(true);
		});
	});
	describe(`received dto without choices with a character`, () => {
		it(`returns a Simple Beat`, () => {
			const beatFactory = new BeatFactory();
			const result = beatFactory.fromDto({
				key: 'beatKey',
				defaultBehavior: {
					text: 'test text',
					character: 'characterKey',
					nextBeat: 'beat key',
				},
			});
			expect(result instanceof SimpleBeat).toBe(true);
		});
	});
	describe(`received dto without choices or a next beat without a character`, () => {
		it(`returns a Final Beat`, () => {
			const beatFactory = new BeatFactory();
			const result = beatFactory.fromDto({
				key: 'beatKey',
				defaultBehavior: {
					text: 'test text',
				},
			});
			expect(result instanceof FinalBeat).toBe(true);
		});
	});
	describe(`received dto without choices or a next beat with a character`, () => {
		it(`returns a Final Beat`, () => {
			const beatFactory = new BeatFactory();
			const result = beatFactory.fromDto({
				key: 'beatKey',
				defaultBehavior: {
					text: 'test text',
					character: 'characterKey',
				},
			});
			expect(result instanceof FinalBeat).toBe(true);
		});
	});
	describe(`received dto with conditional branches and default behavior without a character`, () => {
		it(`returns a First Fit Branch Beat`, () => {
			const beatFactory = new BeatFactory();
			const result = beatFactory.fromDto({
				key: 'beatKey',
				branches: [
					{
						text: 'text 1',
						nextBeat: 'beat 1',
						conditions: [{
							type: SingleConditionType.AT_LEAST_ITEM,
							item: 'itemKey',
							quantity: 3,
						}],
					},
					{
						text: 'text 2',
						nextBeat: 'beat 2',
						conditions: [{
							type: SingleConditionType.AT_MOST_ITEM,
							item: 'itemKey',
							quantity: 3,
						}],
					},
					{
						text: 'text 3',
						nextBeat: 'beat 3',
						conditions: [{
							type: SingleConditionType.AT_MOST_CHAR_TRAIT,
							character: 'character',
							value: 0.3,
							trait: 'a feels',
						}],
					},
					{
						text: 'text 4',
						nextBeat: 'beat 4',
						conditions: [{
							type: SingleConditionType.AT_LEAST_CHAR_TRAIT,
							character: 'character',
							value: 0.3,
							trait: 'a feels',
						}],
					},
					{
						text: 'text 5',
						nextBeat: 'beat 5',
						conditions: [{
							type: SingleConditionType.CHARACTER_AWARE,
							character: 'character',
							memory: 'mem',
						}],
					},
					{
						text: 'text 6',
						nextBeat: 'beat 6',
						conditions: [{
							type: SingleConditionType.CHARACTER_UNAWARE,
							character: 'character',
							memory: 'mem',
						}],
					},
				],
				defaultBehavior: {
					text: 'test text',
					nextBeat: 'beat',
				},
			});
			expect(result instanceof FirstFitBranchBeat).toBe(true);
		});
	});
	describe(`received dto with conditional branches and default behavior with a character`, () => {
		it(`returns a First Fit Branch Beat`, () => {
			const beatFactory = new BeatFactory();
			const result = beatFactory.fromDto({
				key: 'beatKey',
				branches: [
					{
						text: 'text 1',
						nextBeat: 'beat 1',
						conditions: [{
							type: SingleConditionType.AT_LEAST_ITEM,
							item: 'itemKey',
							quantity: 3,
						}],
					},
					{
						text: 'text 2',
						nextBeat: 'beat 2',
						conditions: [{
							type: SingleConditionType.AT_MOST_ITEM,
							item: 'itemKey',
							quantity: 3,
						}],
					},
				],
				defaultBehavior: {
					text: 'test text',
					nextBeat: 'beat',
					character: 'character',
				},
			});
			expect(result instanceof FirstFitBranchBeat).toBe(true);
		});
	});
	describe(`
		received dto with conditional branches and default behavior with characters
		and the greatest cross condition
		`, () => {
		it(`returns a Best Fit Branch Beat`, () => {
			const beatFactory = new BeatFactory();
			const result = beatFactory.fromDto({
				key: 'beatKey',
				crossBranchCondition: {
					type: CrossConditionType.GREATEST_SENTIMENT,
					trait: 'something',
				},
				branches: [
					{
						text: 'text 1',
						nextBeat: 'beat 1',
						character: '1',
						conditions: [{
							type: SingleConditionType.AT_LEAST_ITEM,
							item: 'itemKey',
							quantity: 3,
						}],
					},
					{
						text: 'text 2',
						nextBeat: 'beat 2',
						character: '2',
						conditions: [{
							type: SingleConditionType.AT_MOST_ITEM,
							item: 'itemKey',
							quantity: 3,
						}],
					},
					{
						text: 'text 3',
						nextBeat: 'beat 3',
						character: '3',
						conditions: [{
							type: SingleConditionType.AT_MOST_CHAR_TRAIT,
							character: 'character',
							value: 0.3,
							trait: 'a feels',
						}],
					},
					{
						text: 'text 4',
						nextBeat: 'beat 4',
						character: '4',
						conditions: [{
							type: SingleConditionType.AT_LEAST_CHAR_TRAIT,
							character: 'character',
							value: 0.3,
							trait: 'a feels',
						}],
					},
					{
						text: 'text 5',
						nextBeat: 'beat 5',
						character: '5',
						conditions: [{
							type: SingleConditionType.CHARACTER_AWARE,
							character: 'character',
							memory: 'mem',
						}],
					},
					{
						text: 'text 6',
						nextBeat: 'beat 6',
						character: '6',
						conditions: [{
							type: SingleConditionType.CHARACTER_UNAWARE,
							character: 'character',
							memory: 'mem',
						}],
					},
				],
				defaultBehavior: {
					text: 'test text',
					nextBeat: 'beat',
				},
			});
			expect(result instanceof BestFitBranchBeat).toBe(true);
		});
	});
	describe(`
		received dto with conditional branches and default behavior without a character
		and the greatest cross condition
		`, () => {
		it(`returns a Best Fit Branch Beat`, () => {
			const beatFactory = new BeatFactory();
			const result = beatFactory.fromDto({
				key: 'beatKey',
				crossBranchCondition: {
					type: CrossConditionType.GREATEST_SENTIMENT,
					trait: 'something',
				},
				branches: [
					{
						text: 'text 1',
						nextBeat: 'beat 1',
						character: '1',
					},
					{
						text: 'text 2',
						nextBeat: 'beat 2',
						character: '2',
					},
				],
			});
			expect(result instanceof BestFitBranchBeat).toBe(true);
		});
	});
	describe(`
		received dto with conditional branches and default behavior with characters
		and the least cross condition
		`, () => {
		it(`returns a Best Fit Branch Beat`, () => {
			const beatFactory = new BeatFactory();
			const result = beatFactory.fromDto({
				key: 'beatKey',
				crossBranchCondition: {
					type: CrossConditionType.LEAST_SENTIMENT,
					trait: 'something',
				},
				branches: [
					{
						text: 'text 1',
						nextBeat: 'beat 1',
						character: '1',
						conditions: [{
							type: SingleConditionType.AT_LEAST_ITEM,
							item: 'itemKey',
							quantity: 3,
						}],
					},
					{
						text: 'text 2',
						nextBeat: 'beat 2',
						character: '2',
						conditions: [{
							type: SingleConditionType.AT_MOST_ITEM,
							item: 'itemKey',
							quantity: 3,
						}],
					},
					{
						text: 'text 3',
						nextBeat: 'beat 3',
						character: '3',
						conditions: [{
							type: SingleConditionType.AT_MOST_CHAR_TRAIT,
							character: 'character',
							value: 0.3,
							trait: 'a feels',
						}],
					},
					{
						text: 'text 4',
						nextBeat: 'beat 4',
						character: '4',
						conditions: [{
							type: SingleConditionType.AT_LEAST_CHAR_TRAIT,
							character: 'character',
							value: 0.3,
							trait: 'a feels',
						}],
					},
					{
						text: 'text 5',
						nextBeat: 'beat 5',
						character: '5',
						conditions: [{
							type: SingleConditionType.CHARACTER_AWARE,
							character: 'character',
							memory: 'mem',
						}],
					},
					{
						text: 'text 6',
						nextBeat: 'beat 6',
						character: '6',
						conditions: [{
							type: SingleConditionType.CHARACTER_UNAWARE,
							character: 'character',
							memory: 'mem',
						}],
					},
				],
				defaultBehavior: {
					text: 'test text',
					nextBeat: 'beat',
				},
			});
			expect(result instanceof BestFitBranchBeat).toBe(true);
		});
	});
	describe(`
		received dto with conditional branches and default behavior without a character
		and the least cross condition
		`, () => {
		it(`returns a Best Fit Branch Beat`, () => {
			const beatFactory = new BeatFactory();
			const result = beatFactory.fromDto({
				key: 'beatKey',
				crossBranchCondition: {
					type: CrossConditionType.LEAST_SENTIMENT,
					trait: 'something',
				},
				branches: [
					{
						text: 'text 1',
						nextBeat: 'beat 1',
						character: '1',
					},
					{
						text: 'text 2',
						nextBeat: 'beat 2',
						character: '2',
					},
				],
			});
			expect(result instanceof BestFitBranchBeat).toBe(true);
		});
	});
	describe(`
		received dto with all classes of conditional responses an a default behavior with a character
		some responses have next beats, others don't
	`, () => {
		it(`returns a MultiResponse Beat`, () => {
			const beatFactory = new BeatFactory();
			const result = beatFactory.fromDto({
				key: 'beatKey',
				responses: [
					{
						text: 'text 1',
						conditions: [{
							type: SingleConditionType.AT_LEAST_ITEM,
							item: 'itemKey',
							quantity: 3,
						}],
					},
					{
						text: 'text 2',
						conditions: [{
							type: SingleConditionType.AT_MOST_ITEM,
							item: 'itemKey',
							quantity: 3,
						}],
					},
					{
						text: 'text 3',
						conditions: [{
							type: SingleConditionType.AT_MOST_CHAR_TRAIT,
							character: 'character',
							value: 0.3,
							trait: 'a feels',
						}],
					},
					{
						text: 'text 4',
						nextBeat: 'beat 4',
						conditions: [{
							type: SingleConditionType.AT_LEAST_CHAR_TRAIT,
							character: 'character',
							value: 0.3,
							trait: 'a feels',
						}],
					},
					{
						text: 'text 5',
						nextBeat: 'beat 5',
						conditions: [{
							type: SingleConditionType.CHARACTER_AWARE,
							character: 'character',
							memory: 'mem',
						}],
					},
					{
						text: 'text 6',
						nextBeat: 'beat 6',
						conditions: [{
							type: SingleConditionType.CHARACTER_AWARE,
							character: 'character',
							memory: 'mem',
						}],
					},
				],
				defaultBehavior: {
					text: 'default text',
					nextBeat: 'default nextBeat',
					character: 'characterKey',
				},
			});
			expect(result instanceof MultiResponseBeat).toBe(true);
		});
	});
	describe(`
		received dto with no responses an a default behavior without a character
		some responses have next beats, others don't
	`, () => {
		it(`returns a MultiResponse Beat`, () => {
			const beatFactory = new BeatFactory();
			const result = beatFactory.fromDto({
				key: 'beatKey',
				responses: [
					{
						text: 'text 1',
					},
					{
						text: 'text 2',
					},
				],
				defaultBehavior: {
					text: 'default text',
					nextBeat: 'default nextBeat',
				},
			});
			expect(result instanceof MultiResponseBeat).toBe(true);
		});
	});
});