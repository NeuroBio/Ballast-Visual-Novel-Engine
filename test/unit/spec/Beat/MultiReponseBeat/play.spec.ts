import { NARRATOR } from '../../../../../src/Beat/Beat';
import { MultiResponseBeat } from '../../../../../src/Beat/MultiResponseBeat';
import { Character } from '../../../../../src/Character/Character';
import { CharacterData } from '../../../FakeData/TestData';

describe(`MultiResponseBeat.play`, () => {
	const keyedCharacters = CharacterData.reduce((keyed: { [key: string]: Character}, char) => {
		keyed[char.key] = new Character(char);
		return keyed;
	}, {});
	describe(`
		playing a beat with two non-conditional responses without characters
		and no set next beats
		for the first time
	`, () => {
		it(`returns the multi response beat's key with the first beat's text`, () => {
			const parentBeatKey = 'parent';
			const defaultText = 'default';
			const defaultNextBeat = 'defaultBeat';
			const response1 = { beat: { text: 'first' }, conditions: [] };
			const response2 = { beat: { text: 'second' }, conditions: [] };
			const beat = new MultiResponseBeat({
				key: parentBeatKey,
				responses: [response1, response2],
				defaultBehavior: { text: defaultText, nextBeat: defaultNextBeat },
			});

			expect(beat.play({ characters: keyedCharacters, inventory: {} })).toEqual({
				text: `${NARRATOR}: ${response1.beat.text}`,
				nextBeat: parentBeatKey,
			});
		});
	});
	describe(`
		playing a beat with two non-conditional responses without characters
		and no set next beats
		for the second time
	`, () => {
		it(`returns the multi response beat's default behavior key with the second beat's text`, () => {
			const parentBeatKey = 'parent';
			const defaultText = 'default';
			const defaultNextBeat = 'defaultBeat';
			const response1 = { beat: { text: 'first' }, conditions: [] };
			const response2 = { beat: { text: 'second' }, conditions: [] };
			const beat = new MultiResponseBeat({
				key: parentBeatKey,
				responses: [response1, response2],
				defaultBehavior: { text: defaultText, nextBeat: defaultNextBeat },
			});
			beat.play({ characters: keyedCharacters, inventory: {} });

			expect(beat.play({ characters: keyedCharacters, inventory: {} })).toEqual({
				text: `${NARRATOR}: ${response2.beat.text}`,
				nextBeat: defaultNextBeat,
			});
		});
	});
	describe(`
		playing a beat with two non-conditional responses without characters
		and set next beats
		for the first time
	`, () => {
		it(`returns data from the first response`, () => {
			const parentBeatKey = 'parent';
			const defaultText = 'default';
			const defaultNextBeat = 'defaultBeat';
			const response1 = { beat: { text: 'first', nextBeat: 'firstNext' }, conditions: [] };
			const response2 = { beat: { text: 'second', nextBeat: 'nextNext' }, conditions: [] };
			const beat = new MultiResponseBeat({
				key: parentBeatKey,
				responses: [response1, response2],
				defaultBehavior: { text: defaultText, nextBeat: defaultNextBeat },
			});

			expect(beat.play({ characters: keyedCharacters, inventory: {} })).toEqual({
				text: `${NARRATOR}: ${response1.beat.text}`,
				nextBeat: response1.beat.nextBeat,
			});
		});
	});
	describe(`
		playing a beat with two non-conditional responses without characters
		and set next beats
		for the second time
	`, () => {
		it(`returns data from the second response`, () => {
			const parentBeatKey = 'parent';
			const defaultText = 'default';
			const defaultNextBeat = 'defaultBeat';
			const response1 = { beat: { text: 'first', nextBeat: 'firstNext' }, conditions: [] };
			const response2 = { beat: { text: 'second', nextBeat: 'nextNext' }, conditions: [] };
			const beat = new MultiResponseBeat({
				key: parentBeatKey,
				responses: [response1, response2],
				defaultBehavior: { text: defaultText, nextBeat: defaultNextBeat },
			});
			beat.play({ characters: keyedCharacters, inventory: {} });

			expect(beat.play({ characters: keyedCharacters, inventory: {} })).toEqual({
				text: `${NARRATOR}: ${response2.beat.text}`,
				nextBeat: response2.beat.nextBeat,
			});
		});
	});
	describe(`
		playing a beat with three conditional responses without characters
		and only the second condition is met
		for the first time
	`, () => {
		it(`returns the multi response beat's key with the second beat's text`, () => {
			const parentBeatKey = 'parent';
			const defaultText = 'default';
			const defaultNextBeat = 'defaultBeat';
			const response1 = { beat: { text: 'first' }, conditions: [() => false] };
			const response2 = { beat: { text: 'second' }, conditions: [() => true] };
			const response3 = { beat: { text: 'second' }, conditions: [() => false] };
			const beat = new MultiResponseBeat({
				key: parentBeatKey,
				responses: [response1, response2, response3],
				defaultBehavior: { text: defaultText, nextBeat: defaultNextBeat },
			});

			expect(beat.play({ characters: keyedCharacters, inventory: {} })).toEqual({
				text: `${NARRATOR}: ${response2.beat.text}`,
				nextBeat: defaultNextBeat,
			});
		});
	});
	describe(`
		playing a beat with three conditional responses without characters
		and no set next beats
		and only the second condition is met
		for the second time
	`, () => {
		it(`returns the multi response beat's default behavior key with the third beat's text`, () => {
			const parentBeatKey = 'parent';
			const defaultText = 'default';
			const defaultNextBeat = 'defaultBeat';
			const response1 = { beat: { text: 'first' }, conditions: [() => false] };
			const response2 = { beat: { text: 'second' }, conditions: [() => true] };
			const response3 = { beat: { text: 'second' }, conditions: [() => false] };
			const beat = new MultiResponseBeat({
				key: parentBeatKey,
				responses: [response1, response2, response3],
				defaultBehavior: { text: defaultText, nextBeat: defaultNextBeat },
			});
			beat.play({ characters: keyedCharacters, inventory: {} });

			expect(beat.play({ characters: keyedCharacters, inventory: {} })).toEqual({
				text: `${NARRATOR}: ${defaultText}`,
				nextBeat: defaultNextBeat,
			});
		});
	});
	describe(`
		playing a beat with three conditional responses without characters
		and no set next beats
		no condition is met
		for the first time
	`, () => {
		it(`returns the multi response beat's default behavior`, () => {
			const parentBeatKey = 'parent';
			const defaultText = 'default';
			const defaultNextBeat = 'defaultBeat';
			const response1 = { beat: { text: 'first' }, conditions: [() => false] };
			const response2 = { beat: { text: 'second' }, conditions: [() => false] };
			const response3 = { beat: { text: 'second' }, conditions: [() => false] };
			const beat = new MultiResponseBeat({
				key: parentBeatKey,
				responses: [response1, response2, response3],
				defaultBehavior: { text: defaultText, nextBeat: defaultNextBeat },
			});
			beat.play({ characters: keyedCharacters, inventory: {} });

			expect(beat.play({ characters: keyedCharacters, inventory: {} })).toEqual({
				text: `${NARRATOR}: ${defaultText}`,
				nextBeat: defaultNextBeat,
			});
		});
	});
});
