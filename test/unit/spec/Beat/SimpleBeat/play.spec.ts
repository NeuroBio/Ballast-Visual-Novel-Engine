import { NARRATOR } from '../../../../../src/Beat/Beat';
import { SimpleBeat } from '../../../../../src/Beat/SimpleBeat';

describe(`SimpleBeat.play`, () => {
	describe(`character is unset`, () => {
		it(`returns the Beat's text and speaker`, () => {
			const text = 'Something a character would say';
			const nextBeat = 'beater';
			const beat = new SimpleBeat({ text, nextBeat });
			expect(beat.play()).toEqual({
				text: `${NARRATOR}: ${text}`,
				nextBeat,
			});
		});
	});
	describe(`character is set`, () => {
		it(`returns the Beat's text and speaker`, () => {
			const text = 'Something a character would say';
			const nextBeat = 'beater';
			const characterName = 'this character';
			const character = characterName;
			const beat = new SimpleBeat({ character, text, nextBeat });
			expect(beat.play()).toEqual({
				text: `${characterName}: ${text}`,
				nextBeat,
			});
		});
	});
});

