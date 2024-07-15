import { NARRATOR } from '../../../../../src/Beat/Beat';
import { FinalBeat } from '../../../../../src/Beat/FinalBeat';
import { Character } from '../../../../../src/Character/Character';
import { CharacterData } from '../../../FakeData/TestData';

describe(`FinalBeat.play`, () => {
	const keyedCharacters = CharacterData.reduce((keyed: { [key: string]: Character}, char) => {
		keyed[char.key] = new Character(char);
		return keyed;
	}, {});
	describe(`character is unset`, () => {
		it(`returns the Beat's text and speaker`, () => {
			const text = 'Something a character would say';
			const beat = new FinalBeat({ text });
			expect(beat.play({ characters: keyedCharacters })).toEqual({
				text: `${NARRATOR}: ${text}`,
			});
		});
	});
	describe(`character is set`, () => {
		it(`returns the Beat's text and speaker`, () => {
			const text = 'Something a character would say';
			const characterKey = CharacterData[0].key;
			const characterName = CharacterData[0].name;
			const beat = new FinalBeat({ character: characterKey, text });
			expect(beat.play({ characters: keyedCharacters })).toEqual({
				text: `${characterName}: ${text}`,
			});
		});
	});
});
