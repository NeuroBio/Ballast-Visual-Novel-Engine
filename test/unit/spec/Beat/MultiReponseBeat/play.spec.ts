import { MultiResponseBeat } from '../../../../../src/Beat/MultiResponseBeat';
import { Character } from '../../../../../src/Character/Character';
import { CharacterData } from '../../../FakeData/TestData';

describe(`MultiResponseBeat.play`, () => {
	const keyedCharacters = CharacterData.reduce((keyed: { [key: string]: Character}, char) => {
		keyed[char.key] = new Character(char);
		return keyed;
	}, {});
	describe(`
		playing a beat with two non-conditional responses
		and no set next beat
		for the first time
	`, () => {
		it(`returns the multi response beat's key`, () => {
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
				text: '',
				nextBeat: defaultNextBeat,
			});
		});
	});
	// fill out missing scenarios
});
