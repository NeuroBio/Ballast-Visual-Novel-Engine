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
			const beat = new SimpleBeat({ text, nextBeat });
			expect(beat.play(keyedCharacters)).toEqual({
				text: `${NARRATOR}: ${text}`,
				nextBeat,
			});
		});
	});
	describe(`character is set`, () => {
		it(`returns the Beat's text and speaker`, () => {
			const text = 'Something a character would say';
			const nextBeat = 'beater';
			const characterKey = CharacterData[0].key;
			const characterName = CharacterData[0].name;
			const beat = new SimpleBeat({ character: characterKey, text, nextBeat });
			expect(beat.play(keyedCharacters)).toEqual({
				text: `${characterName}: ${text}`,
				nextBeat,
			});
		});
	});
});

