import { NARRATOR } from '../../../../../src/Beat/Beat';
import { SimpleBeat } from '../../../../../src/Beat/SimpleBeat';
import { Character } from '../../../../../src/Character/Character';
import { CharacterData } from '../../../FakeData/TestData';

describe(`SimpleBeat.play`, () => {
	const keyedCharacters = CharacterData.reduce((keyed: { [key: string]: Character}, char) => {
		keyed[char.key] = new Character(char);
		return keyed;
	}, {});
	describe(`character is unset`, () => {
		it(`returns the Beat's text and speaker`, () => {
			const text = 'Something a character would say';
			const nextBeat = 'beater';
			const key = 'key';
			const beat = new SimpleBeat({ key, defaultBehavior: { text, nextBeat } });
			expect(beat.play({ characters: keyedCharacters, inventory: {} })).toEqual({
				text,
				nextBeat,
				speaker: NARRATOR,
			});
		});
	});
	describe(`character is set`, () => {
		it(`returns the Beat's text and speaker`, () => {
			const text = 'Something a character would say';
			const nextBeat = 'beater';
			const characterKey = CharacterData[0].key;
			const characterName = CharacterData[0].name;
			const key = 'key';
			const beat = new SimpleBeat({ key, defaultBehavior: { text, nextBeat, character: characterKey } });
			expect(beat.play({ characters: keyedCharacters, inventory: {} })).toEqual({
				text,
				nextBeat,
				speaker: characterName,
			});
		});
	});
});

