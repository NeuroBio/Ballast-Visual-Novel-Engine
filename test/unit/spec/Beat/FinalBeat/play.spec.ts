import { NARRATOR } from '../../../../../src/Beat/Beat';
import { FinalBeat } from '../../../../../src/Beat/FinalBeat';
import { Fakes } from '../../../fakes/index';

describe(`FinalBeat.play`, () => {
	describe(`character is unset`, () => {
		it(`returns the Beat's text and speaker`, () => {
			const text = 'Something a character would say';
			const beat = new FinalBeat({ text });
			expect(beat.play()).toEqual({
				text: `${NARRATOR}: ${text}`,
			});
		});
	});
	describe(`character is set`, () => {
		it(`returns the Beat's text and speaker`, () => {
			const text = 'Something a character would say';
			const characterName = 'this character';
			const character = new Fakes.Character({ name: characterName });
			const beat = new FinalBeat({ character, text });
			expect(beat.play()).toEqual({
				text: `${characterName}: ${text}`,
			});
		});
	});
});
