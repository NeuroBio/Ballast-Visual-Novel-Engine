import { NARRATOR } from '../../../../../src/Beat/Beat';
import { BeatFactory, SingleConditionType, CrossConditionType, ChoiceDto } from '../../../../../src/Beat/BeatFactory';
import { BestFitBranchBeat } from '../../../../../src/Beat/BestFitBranchBeat';
import { ChoiceBeat } from '../../../../../src/Beat/ChoiceBeat';
import { FinalBeat } from '../../../../../src/Beat/FinalBeat';
import { FirstFitBranchBeat } from '../../../../../src/Beat/FirstFitBranchBeat';
import { MultiResponseBeat } from '../../../../../src/Beat/MultiResponseBeat';
import { SimpleBeat } from '../../../../../src/Beat/SimpleBeat';

describe('BeatFactory.fromDto', () => {
	const Error = Object.freeze({
		NON_BEAT: 'Received malformed beat data for beat beatKey.  See the documentation for expected shapes for different beat types.',
		SIDE_EFFECTS_BAD: 'Received malformed display side effect data for beat beatKey.  See the documentation for expected shapes for side effects.',
		BAD_SINGLE_CONDITION: 'Received an unexpected type for single condition on beat beatKey',
		BAD_CROSS_CONDITION: 'Received an unexpected type for cross condition on beat beatKey',
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
		const itemKey = 'itemKey', trait = 'a feels', character = 'char1', character2 = 'char2',
			memory1 = 'mem1', memory2 = 'mem2', defaultText = 'default text', defaultBeat = 'default nextBeat';
		const choices: ChoiceDto[] = [
			{
				text: 'text 1',
				nextBeat: 'beat 1',
				conditions: [{
					type: SingleConditionType.AT_LEAST_ITEM,
					item: itemKey,
					quantity: 3,
				}],
			},
			{
				text: 'text 2',
				nextBeat: 'beat 2',
				conditions: [{
					type: SingleConditionType.AT_MOST_ITEM,
					item: itemKey,
					quantity: 1,
				}],
			},
			{
				text: 'text 3',
				nextBeat: 'beat 3',
				conditions: [{
					type: SingleConditionType.AT_MOST_CHAR_TRAIT,
					character,
					value: 0.1,
					trait,
				}],
			},
			{
				text: 'text 4',
				nextBeat: 'beat 4',
				conditions: [{
					type: SingleConditionType.AT_LEAST_CHAR_TRAIT,
					character,
					value: 0.3,
					trait,
				}],
			},
			{
				text: 'text 5',
				nextBeat: 'beat 5',
				conditions: [{
					type: SingleConditionType.CHARACTER_AWARE,
					character,
					memory: memory1,
				}],
			},
			{
				text: 'text 6',
				nextBeat: 'beat 6',
				conditions: [{
					type: SingleConditionType.CHARACTER_UNAWARE,
					character,
					memory: memory2,
				}],
			},
			{
				text: 'text 7',
				nextBeat: 'beat 7',
				conditions: [{
					type: SingleConditionType.CHARACTER_PRESENT,
					character,
				}],
			},
			{
				text: 'text 8',
				nextBeat: 'beat 8',
				conditions: [{
					type: SingleConditionType.CHARACTER_ABSENT,
					character: character2,
				}],
			},
		];
		let result: any;
		beforeAll(() => {
			const beatFactory = new BeatFactory();
			result = beatFactory.fromDto({
				key: 'beatKey',
				choices,
				defaultBehavior: {
					text: defaultText,
					nextBeat: defaultBeat,
					character,
				},
			});
		});
		it(`returns a Choice Beat`, () => {
			expect(result instanceof ChoiceBeat).toBe(true);
		});
		it(`all conditions can fail`, () => {
			const characters = { [character]: {
				hasMemory: jest.fn(),
				traits: {},
			} };
			characters[character].hasMemory.mockReturnValueOnce(false);
			characters[character].hasMemory.mockReturnValueOnce(true);
			const inventory = { [itemKey]: 2 };
			const scene = { characters: new Set([ character2 ]) };
			expect(result.play({ characters, inventory, scene })).toEqual({
				choices: choices.map(x => ({ text: x.text, nextBeat: x.nextBeat, mayPlay: false })),
				default: {
					text: defaultText,
					nextBeat: defaultBeat,
					speaker: NARRATOR,
					saveData: expect.any(Object),
					sceneData: expect.any(Object),
				},
				saveData: expect.any(Object),
			});
		});
		it(`item at least can pass`, () => {
			const characters = { [character]: {
				hasMemory: jest.fn(),
				traits: {},
			} };
			characters[character].hasMemory.mockReturnValueOnce(false);
			characters[character].hasMemory.mockReturnValueOnce(true);
			const inventory = { [itemKey]: 4 };
			const scene = { characters: new Set([ character2 ]) };
			expect(result.play({ characters, inventory, scene })).toEqual({
				choices: choices.map(x => {
					const beat = { text: x.text, nextBeat: x.nextBeat, mayPlay: false };
					if (beat.text === 'text 1') {
						beat.mayPlay = true;
					}
					return beat;
				}),
				saveData: expect.any(Object),
			});
		});
		it(`item at most can pass`, () => {
			const characters = { [character]: {
				hasMemory: jest.fn(),
				traits: {},
			} };
			characters[character].hasMemory.mockReturnValueOnce(false);
			characters[character].hasMemory.mockReturnValueOnce(true);
			const inventory = { [itemKey]: 1 };
			const scene = { characters: new Set([ character2 ]) };
			expect(result.play({ characters, inventory, scene })).toEqual({
				choices: choices.map(x => {
					const beat = { text: x.text, nextBeat: x.nextBeat, mayPlay: false };
					if (beat.text === 'text 2') {
						beat.mayPlay = true;
					}
					return beat;
				}),
				saveData: expect.any(Object),
			});
		});
		it(`character trait at most can pass`, () => {
			const characters = { [character]: {
				hasMemory: jest.fn(),
				traits: { [trait]: 0.05 },
			} };
			characters[character].hasMemory.mockReturnValueOnce(false);
			characters[character].hasMemory.mockReturnValueOnce(true);
			const inventory = { [itemKey]: 2 };
			const scene = { characters: new Set([ character2 ]) };
			expect(result.play({ characters, inventory, scene })).toEqual({
				choices: choices.map(x => {
					const beat = { text: x.text, nextBeat: x.nextBeat, mayPlay: false };
					if (beat.text === 'text 3') {
						beat.mayPlay = true;
					}
					return beat;
				}),
				saveData: expect.any(Object),
			});
		});
		it(`character trait at least can pass`, () => {
			const characters = { [character]: {
				hasMemory: jest.fn(),
				traits: { [trait]: 0.35 },
			} };
			characters[character].hasMemory.mockReturnValueOnce(false);
			characters[character].hasMemory.mockReturnValueOnce(true);
			const inventory = { [itemKey]: 2 };
			const scene = { characters: new Set([ character2 ]) };
			expect(result.play({ characters, inventory, scene })).toEqual({
				choices: choices.map(x => {
					const beat = { text: x.text, nextBeat: x.nextBeat, mayPlay: false };
					if (beat.text === 'text 4') {
						beat.mayPlay = true;
					}
					return beat;
				}),
				saveData: expect.any(Object),
			});
		});
		it(`character aware can pass`, () => {
			const characters = { [character]: {
				hasMemory: jest.fn(),
				traits: { [trait]: 0.2 },
			} };
			characters[character].hasMemory.mockReturnValueOnce(true);
			characters[character].hasMemory.mockReturnValueOnce(true);
			const inventory = { [itemKey]: 2 };
			const scene = { characters: new Set([ character2 ]) };
			expect(result.play({ characters, inventory, scene })).toEqual({
				choices: choices.map(x => {
					const beat = { text: x.text, nextBeat: x.nextBeat, mayPlay: false };
					if (beat.text === 'text 5') {
						beat.mayPlay = true;
					}
					return beat;
				}),
				saveData: expect.any(Object),
			});
		});
		it(`character unaware can pass`, () => {
			const characters = { [character]: {
				hasMemory: jest.fn(),
				traits: { [trait]: 0.2 },
			} };
			characters[character].hasMemory.mockReturnValueOnce(false);
			characters[character].hasMemory.mockReturnValueOnce(false);
			const inventory = { [itemKey]: 2 };
			const scene = { characters: new Set([ character2 ]) };
			expect(result.play({ characters, inventory, scene })).toEqual({
				choices: choices.map(x => {
					const beat = { text: x.text, nextBeat: x.nextBeat, mayPlay: false };
					if (beat.text === 'text 6') {
						beat.mayPlay = true;
					}
					return beat;
				}),
				saveData: expect.any(Object),
			});
		});
		it(`character present can pass`, () => {
			const characters = { [character]: {
				hasMemory: jest.fn(),
				traits: {},
			} };
			characters[character].hasMemory.mockReturnValueOnce(false);
			characters[character].hasMemory.mockReturnValueOnce(true);
			const inventory = { [itemKey]: 2 };
			const scene = { characters: new Set([ character, character2 ]) };
			expect(result.play({ characters, inventory, scene })).toEqual({
				choices: choices.map(x => {
					const beat = { text: x.text, nextBeat: x.nextBeat, mayPlay: false };
					if (beat.text === 'text 7') {
						beat.mayPlay = true;
					}
					return beat;
				}),
				saveData: expect.any(Object),
			});
		});
		it(`character absent can pass`, () => {
			const characters = { [character]: {
				hasMemory: jest.fn(),
				traits: {},
			} };
			characters[character].hasMemory.mockReturnValueOnce(false);
			characters[character].hasMemory.mockReturnValueOnce(true);
			const inventory = { [itemKey]: 2 };
			const scene = { characters: new Set() };
			expect(result.play({ characters, inventory, scene })).toEqual({
				choices: choices.map(x => {
					const beat = { text: x.text, nextBeat: x.nextBeat, mayPlay: false };
					if (beat.text === 'text 8') {
						beat.mayPlay = true;
					}
					return beat;
				}),
				saveData: expect.any(Object),
			});
		});
	});
	describe(`received dto with unexpected single condition type`, () => {
		it(`throws and error`, () => {
			const character = 'char1', defaultText = 'default text', defaultBeat = 'default nextBeat';
			const choices: ChoiceDto[] = [{
				text: 'no',
				nextBeat: 'no',
				conditions: [{
					// @ts-expect-error testing bad data
					type: 'nah man',
				}],
			}];
			const beatFactory = new BeatFactory();
			expect(() => beatFactory.fromDto({
				key: 'beatKey',
				choices,
				defaultBehavior: {
					text: defaultText,
					nextBeat: defaultBeat,
					character,
				},
			})).toThrow(Error.BAD_SINGLE_CONDITION);
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
		received dto without conditional branches and default behavior without a character
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
		received dto with conditional branches and default behavior without a character
		and the greatest cross condition, checking cross conditional behavior
	`, () => {
		const item = 'itemKey', defaultText = 'default text', defaultBeat = 'defaultBeat', trait = 'something';
		let result: any;
		beforeAll(() => {
			const beatFactory = new BeatFactory();
			result = beatFactory.fromDto({
				key: 'beatKey',
				crossBranchCondition: {
					type: CrossConditionType.GREATEST_SENTIMENT,
					trait,
				},
				branches: [
					{
						text: 'text 1',
						nextBeat: 'beat 1',
						character: '1',
						conditions: [{
							type: SingleConditionType.AT_LEAST_ITEM,
							item,
							quantity: 1,
						}],
					},
					{
						text: 'text 2',
						nextBeat: 'beat 2',
						character: '2',
						conditions: [{
							type: SingleConditionType.AT_LEAST_ITEM,
							item,
							quantity: 2,
						}],
					},
					{
						text: 'text 3',
						nextBeat: 'beat 3',
						character: '2',
						conditions: [{
							type: SingleConditionType.AT_LEAST_ITEM,
							item,
							quantity: 3,
						}],
					},
				],
				defaultBehavior: {
					text: defaultText,
					nextBeat: defaultBeat,
				},
			});
		});
		it(`returns a Best Fit Branch Beat`, () => {
			expect(result instanceof BestFitBranchBeat).toBe(true);
		});
		describe(`two conditionals pass`, () => {
			it(`returns the character with the greatest specified trait`, () => {
				const characters = {
					[1]: { traits: { [trait]: 1 }, key: '1' },
					[2]: { traits: { [trait]: 2 }, key: '2' },
				};
				const inventory = {
					[item]: 2,
				};
				expect(result.play({ characters, inventory })).toEqual({
					text: `text 2`,
					nextBeat: 'beat 2',
					speaker: NARRATOR,
					saveData: expect.any(Object),
					sceneData: expect.any(Object),
				});
			});
		});
		describe(`three conditionals pass for 2 characters, where the two characters tie`, () => {
			it(`returns the first character to come up in the tied the branches`, () => {
				const characters = {
					[1]: { traits: { [trait]: 2 }, key: '1' },
					[2]: { traits: { [trait]: 2 }, key: '2' },
				};
				const inventory = {
					[item]: 3,
				};
				expect(result.play({ characters, inventory })).toEqual({
					text: `text 1`,
					nextBeat: 'beat 1',
					speaker: NARRATOR,
					saveData: expect.any(Object),
					sceneData: expect.any(Object),
				});
			});
		});
		describe(`two conditionals pass, and the first character has the trait unset`, () => {
			it(`returns the character with the greatest specified trait`, () => {
				const characters = {
					[1]: { traits: { }, key: '1' },
					[2]: { traits: { [trait]: 2 }, key: '2' },
				};
				const inventory = {
					[item]: 2,
				};
				expect(result.play({ characters, inventory })).toEqual({
					text: `text 2`,
					nextBeat: 'beat 2',
					speaker: NARRATOR,
					saveData: expect.any(Object),
					sceneData: expect.any(Object),
				});
			});
		});
		describe(`two conditionals pass, and the second character has the trait unset`, () => {
			it(`returns the character with the greatest specified trait`, () => {
				const characters = {
					[1]: { traits: { [trait]: 0 }, key: '1' },
					[2]: { traits: { }, key: '2' },
				};
				const inventory = {
					[item]: 2,
				};
				expect(result.play({ characters, inventory })).toEqual({
					text: `text 1`,
					nextBeat: 'beat 1',
					speaker: NARRATOR,
					saveData: expect.any(Object),
					sceneData: expect.any(Object),
				});
			});
		});
	});
	describe(`received dto with unknown cross conditional behavior`, () => {
		it(`throws an error`, () => {
			const trait = 'something';
			const beatFactory = new BeatFactory();
			expect (() => beatFactory.fromDto({
				key: 'beatKey',
				crossBranchCondition: {
					// @ts-expect-error testing bad data
					type: 'nah man',
					trait,
				},
				branches: [{
					text: 'text 3',
					nextBeat: 'beat 3',
					character: '2',
				}],
			})).toThrow(Error.BAD_CROSS_CONDITION);
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
		received dto without conditional branches and default behavior without a character
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
		received dto with fake conditional branches and default behavior without a character
		and the least cross condition, checking cross conditional behavior
		`, () => {
		const item = 'itemKey', defaultText = 'default text', defaultBeat = 'defaultBeat', trait = 'something';
		let result: any;
		beforeAll(() => {
			const beatFactory = new BeatFactory();
			result = beatFactory.fromDto({
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
							item,
							quantity: 1,
						}],
					},
					{
						text: 'text 2',
						nextBeat: 'beat 2',
						character: '2',
						conditions: [{
							type: SingleConditionType.AT_LEAST_ITEM,
							item,
							quantity: 2,
						}],
					},
					{
						text: 'text 3',
						nextBeat: 'beat 3',
						character: '2',
						conditions: [{
							type: SingleConditionType.AT_LEAST_ITEM,
							item,
							quantity: 3,
						}],
					},
				],
				defaultBehavior: {
					text: defaultText,
					nextBeat: defaultBeat,
				},
			});
		});
		it(`returns a Best Fit Branch Beat`, () => {
			expect(result instanceof BestFitBranchBeat).toBe(true);
		});
		describe(`two conditionals pass`, () => {
			it(`returns the character with the greatest specified trait`, () => {
				const characters = {
					[1]: { traits: { [trait]: 2 }, key: '1' },
					[2]: { traits: { [trait]: 1 }, key: '2' },
				};
				const inventory = {
					[item]: 2,
				};
				expect(result.play({ characters, inventory })).toEqual({
					text: `text 2`,
					nextBeat: 'beat 2',
					speaker: NARRATOR,
					saveData: expect.any(Object),
					sceneData: expect.any(Object),
				});
			});
		});
		describe(`three conditionals pass for 2 characters, where the two characters tie`, () => {
			it(`returns the first character to come up in the tied the branches`, () => {
				const characters = {
					[1]: { traits: { [trait]: 1 }, key: '1' },
					[2]: { traits: { [trait]: 1 }, key: '2' },
				};
				const inventory = {
					[item]: 3,
				};
				expect(result.play({ characters, inventory })).toEqual({
					text: `text 1`,
					nextBeat: 'beat 1',
					speaker: NARRATOR,
					saveData: expect.any(Object),
					sceneData: expect.any(Object),
				});
			});
		});
		describe(`two conditionals pass, and the first character has the trait unset`, () => {
			it(`returns the character with the least specified trait`, () => {
				const characters = {
					[1]: { traits: { }, key: '1' },
					[2]: { traits: { [trait]: -0.1 }, key: '2' },
				};
				const inventory = {
					[item]: 2,
				};
				expect(result.play({ characters, inventory })).toEqual({
					text: `text 2`,
					nextBeat: 'beat 2',
					speaker: NARRATOR,
					saveData: expect.any(Object),
					sceneData: expect.any(Object),
				});
			});
		});
		describe(`two conditionals pass, and the second character has the trait unset`, () => {
			it(`returns the character with the least specified trait`, () => {
				const characters = {
					[1]: { traits: { [trait]: 0 }, key: '1' },
					[2]: { traits: { }, key: '2' },
				};
				const inventory = {
					[item]: 2,
				};
				expect(result.play({ characters, inventory })).toEqual({
					text: `text 1`,
					nextBeat: 'beat 1',
					speaker: NARRATOR,
					saveData: expect.any(Object),
					sceneData: expect.any(Object),
				});
			});
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
							type: SingleConditionType.CHARACTER_UNAWARE,
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
	describe(`
		received dto without choices without a character and with default behavior
		with valid data for all display side effects
	`, () => {
		it(`returns a Simple Beat`, () => {
			const beatFactory = new BeatFactory();
			const result = beatFactory.fromDto({
				key: 'beatKey',
				defaultBehavior: {
					text: 'test text',
					nextBeat: 'beat key',
					sceneData: {
						setBackground: 'background',
						updateCharacterSprites: [{
							character: 'char',
							sprite: 'emotion',
						}],
						moveCharacters: [{
							character: 'char',
							newPosition: 0,
						}],
						removeCharacters: [{ character: 'char' }],
						addCharacters: [{
							character: 'char',
							position: 0,
							sprite: 'emotion',
						}],
					},
				},
			});
			expect(result instanceof SimpleBeat).toBe(true);
		});
	});
	describe(`
		received dto without choices without a character and with default behavior
		with invalid data for background display side effect
		`, () => {
		it(`throws an error`, () => {
			const beatFactory = new BeatFactory();
			expect(() => beatFactory.fromDto({
				key: 'beatKey',
				defaultBehavior: {
					text: 'test text',
					nextBeat: 'beat key',
					sceneData: {
						setBackground: '',
					},
				},
			})).toThrow(Error.SIDE_EFFECTS_BAD);
		});
	});
	describe(`
		received dto without choices without a character and with default behavior
		with invalid data for update character sprites display side effect
		`, () => {
		it(`throws an error`, () => {
			const beatFactory = new BeatFactory();
			expect(() => beatFactory.fromDto({
				key: 'beatKey',
				defaultBehavior: {
					text: 'test text',
					nextBeat: 'beat key',
					sceneData: {
					// @ts-expect-error intentionally passing bad data
						updateCharacterSprites: [{}],
					},
				},
			})).toThrow(Error.SIDE_EFFECTS_BAD);
		});
	});
	describe(`
		received dto without choices without a character and with default behavior
		with invalid data for move characters display side effect
		`, () => {
		it(`throws an error`, () => {
			const beatFactory = new BeatFactory();
			expect(() => beatFactory.fromDto({
				key: 'beatKey',
				defaultBehavior: {
					text: 'test text',
					nextBeat: 'beat key',
					sceneData: {
						// @ts-expect-error intentionally passing bad data
						moveCharacters: [{}],
					},
				},
			})).toThrow(Error.SIDE_EFFECTS_BAD);
		});
	});
	describe(`
		received dto without choices without a character and with default behavior
		with invalid data for remove characters display side effect
		`, () => {
		it(`throws an error`, () => {
			const beatFactory = new BeatFactory();
			expect(() => beatFactory.fromDto({
				key: 'beatKey',
				defaultBehavior: {
					text: 'test text',
					nextBeat: 'beat key',
					sceneData: {
					// @ts-expect-error intentionally passing bad data
						removeCharacters: [{}],
					},
				},
			})).toThrow(Error.SIDE_EFFECTS_BAD);
		});
	});
	describe(`
		received dto without choices without a character and with default behavior
		with invalid data for add characters display side effect
		`, () => {
		it(`throws an error`, () => {
			const beatFactory = new BeatFactory();
			expect(() => beatFactory.fromDto({
				key: 'beatKey',
				defaultBehavior: {
					text: 'test text',
					nextBeat: 'beat key',
					sceneData: {
					// @ts-expect-error intentionally passing bad data
						addCharacters: [{}],
					},
				},
			})).toThrow(Error.SIDE_EFFECTS_BAD);
		});
	});
	describe(`
		received dto without choices without a character and with default behavior
		with valid data for all display side effects
	`, () => {
		it(`returns a Final Beat`, () => {
			const beatFactory = new BeatFactory();
			const result = beatFactory.fromDto({
				key: 'beatKey',
				defaultBehavior: {
					text: 'test text',
					sceneData: {
						setBackground: 'background',
						updateCharacterSprites: [{
							character: 'char',
							sprite: 'emotion',
						}],
						moveCharacters: [{
							character: 'char',
							newPosition: 0,
						}],
						removeCharacters: [{ character: 'char' }],
						addCharacters: [{
							character: 'char',
							position: 0,
							sprite: 'emotion',
						}],
					},
				},
			});
			expect(result instanceof FinalBeat).toBe(true);
		});
	});
	describe(`
		received dto with choices without a character and with default behavior
		with valid data for all display side effects
	`, () => {
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
				defaultBehavior: {
					text: 'test text',
					nextBeat: 'beat key',
					sceneData: {
						setBackground: 'background',
						updateCharacterSprites: [{
							character: 'char',
							sprite: 'emotion',
						}],
						moveCharacters: [{
							character: 'char',
							newPosition: 0,
						}],
						removeCharacters: [{ character: 'char' }],
						addCharacters: [{
							character: 'char',
							position: 0,
							sprite: 'emotion',
						}],
					},
				},
			});
			expect(result instanceof ChoiceBeat).toBe(true);
		});
	});
	describe(`
		received dto with responses without a character and with default behavior
		with valid data for all display side effects
	`, () => {
		it(`returns a Multi Response Beat`, () => {
			const beatFactory = new BeatFactory();
			const result = beatFactory.fromDto({
				key: 'beatKey',
				responses: [
					{
						text: 'text 1',
					},
					{
						text: 'text 2',
						sceneData: {
							setBackground: 'background',
							updateCharacterSprites: [{
								character: 'char',
								sprite: 'emotion',
							}],
							moveCharacters: [{
								character: 'char',
								newPosition: 0,
							}],
							removeCharacters: [{ character: 'char' }],
							addCharacters: [{
								character: 'char',
								position: 0,
								sprite: 'emotion',
							}],
						},
					},
				],
				defaultBehavior: {
					text: 'test text',
					nextBeat: 'beat key',
					sceneData: {
						setBackground: 'background',
						updateCharacterSprites: [{
							character: 'char',
							sprite: 'emotion',
						}],
						moveCharacters: [{
							character: 'char',
							newPosition: 0,
						}],
						removeCharacters: [{ character: 'char' }],
						addCharacters: [{
							character: 'char',
							position: 0,
							sprite: 'emotion',
						}],
					},
				},
			});
			expect(result instanceof MultiResponseBeat).toBe(true);
		});
	});
	describe(`
		received dto with branches and cross condition without a character and with default behavior
		with valid data for all display side effects
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
						sceneData: {
							setBackground: 'background',
							updateCharacterSprites: [{
								character: 'char',
								sprite: 'emotion',
							}],
							moveCharacters: [{
								character: 'char',
								newPosition: 0,
							}],
							removeCharacters: [{ character: 'char' }],
							addCharacters: [{
								character: 'char',
								position: 0,
								sprite: 'emotion',
							}],
						},
					},
				],
				defaultBehavior: {
					text: 'test text',
					nextBeat: 'beat key',
					sceneData: {
						setBackground: 'background',
						updateCharacterSprites: [{
							character: 'char',
							sprite: 'emotion',
						}],
						moveCharacters: [{
							character: 'char',
							newPosition: 0,
						}],
						removeCharacters: [{ character: 'char' }],
						addCharacters: [{
							character: 'char',
							position: 0,
							sprite: 'emotion',
						}],
					},
				},
			});
			expect(result instanceof BestFitBranchBeat).toBe(true);
		});
	});
	describe(`
		received dto with branches without a character and with default behavior
		with valid data for all display side effects
	`, () => {
		it(`returns a First Fit Branch Beat`, () => {
			const beatFactory = new BeatFactory();
			const result = beatFactory.fromDto({
				key: 'beatKey',
				branches: [
					{
						text: 'text 1',
						nextBeat: 'beat 1',
						conditions: [{
							type: SingleConditionType.CHARACTER_UNAWARE,
							character: 'character',
							memory: 'mem',
						}],
						character: '1',
					},
					{
						text: 'text 2',
						nextBeat: 'beat 2',
						conditions: [{
							type: SingleConditionType.CHARACTER_UNAWARE,
							character: 'character',
							memory: 'mem',
						}],
						character: '2',
						sceneData: {
							setBackground: 'background',
							updateCharacterSprites: [{
								character: 'char',
								sprite: 'emotion',
							}],
							moveCharacters: [{
								character: 'char',
								newPosition: 0,
							}],
							removeCharacters: [{ character: 'char' }],
							addCharacters: [{
								character: 'char',
								position: 0,
								sprite: 'emotion',
							}],
						},
					},
				],
				defaultBehavior: {
					text: 'test text',
					nextBeat: 'beat key',
					sceneData: {
						setBackground: 'background',
						updateCharacterSprites: [{
							character: 'char',
							sprite: 'emotion',
						}],
						moveCharacters: [{
							character: 'char',
							newPosition: 0,
						}],
						removeCharacters: [{ character: 'char' }],
						addCharacters: [{
							character: 'char',
							position: 0,
							sprite: 'emotion',
						}],
					},
				},
			});
			expect(result instanceof FirstFitBranchBeat).toBe(true);
		});
	});
});