import { BeatFactory, ConditionalType } from '../../../../../src/Beat/BeatFactory';
import { ChoiceBeat } from '../../../../../src/Beat/ChoiceBeat';
import { FinalBeat } from '../../../../../src/Beat/FinalBeat';
import { SimpleBeat } from '../../../../../src/Beat/SimpleBeat';

describe('BeatFactory.fromDto', () => {
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
				character: 'character name',
				choices: [
					{
						text: 'text 1',
						nextBeat: 'beat 1',
						conditions: [{
							type: ConditionalType.AT_LEAST_ITEM,
							item: 'itemKey',
							quantity: 3,
						}],
					},
					{
						text: 'text 2',
						nextBeat: 'beat 2',
						conditions: [{
							type: ConditionalType.AT_MOST_ITEM,
							item: 'itemKey',
							quantity: 3,
						}],
					},
					{
						text: 'text 3',
						nextBeat: 'beat 3',
						conditions: [{
							type: ConditionalType.AT_MOST_CHAR_FEELS,
							character: 'character',
							value: 0.3,
							sentiment: 'a feels',
						}],
					},
					{
						text: 'text 4',
						nextBeat: 'beat 4',
						conditions: [{
							type: ConditionalType.AT_LEAST_CHAR_FEELS,
							character: 'character',
							value: 0.3,
							sentiment: 'a feels',
						}],
					},
					{
						text: 'text 5',
						nextBeat: 'beat 5',
						conditions: [{
							type: ConditionalType.CHARACTER_AWARE,
							character: 'character',
							memory: 'mem',
						}],
					},
					{
						text: 'text 6',
						nextBeat: 'beat 6',
						conditions: [{
							type: ConditionalType.CHARACTER_AWARE,
							character: 'character',
							memory: 'mem',
						}],
					},
				],
				defaultBehavior: {
					text: 'default text',
					nextBeat: 'default nextBeat',
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
				text: 'test text',
				nextBeat: 'beat key',
			});
			expect(result instanceof SimpleBeat).toBe(true);
		});
	});
	describe(`received dto without choices with a character`, () => {
		it(`returns a Simple Beat`, () => {
			const beatFactory = new BeatFactory();
			const result = beatFactory.fromDto({
				key: 'beatKey',
				text: 'test text',
				character: 'character name',
				nextBeat: 'beat key',
			});
			expect(result instanceof SimpleBeat).toBe(true);
		});
	});
	describe(`received dto without choices or a next beat without a character`, () => {
		it(`returns a Final Beat`, () => {
			const beatFactory = new BeatFactory();
			const result = beatFactory.fromDto({
				key: 'beatKey',
				text: 'test text',
			});
			expect(result instanceof FinalBeat).toBe(true);
		});
	});
	describe(`received dto without choices or a next beat with a character`, () => {
		it(`returns a Final Beat`, () => {
			const beatFactory = new BeatFactory();
			const result = beatFactory.fromDto({
				key: 'beatKey',
				text: 'test text',
				character: 'character name',
			});
			expect(result instanceof FinalBeat).toBe(true);
		});
	});
});