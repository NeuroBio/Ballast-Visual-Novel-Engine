import { NARRATOR } from '../../../../../src/Beat/Beat';
import { SimpleBeat } from '../../../../../src/Beat/SimpleBeat';
import { Fakes } from '../../../fakes/index';

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
			const character = new Fakes.Character({ name: characterName });
			const beat = new SimpleBeat({ character, text, nextBeat });
			expect(beat.play()).toEqual({
				text: `${characterName}: ${text}`,
				nextBeat,
			});
		});
	});
});

