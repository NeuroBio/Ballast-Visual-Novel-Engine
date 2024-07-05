import { Beat, NARRATOR } from '../../../../src/Beat/Beat';
import { Fakes } from '../../fakes/index';

describe('Beat.play', () => {
	describe(`character is unset`, () => {
		it('returns the Beat\'s text and speaker', () => {
			const text = 'Something a character would say';
			const beat = new Beat({ text });
			expect(beat.play()).toBe(`${NARRATOR}: ${text}`);
		});
	});
	describe(`character is set`, () => {
		it('returns the Beat\'s text and speaker', () => {
			const text = 'Something a character would say';
			const characterName = 'this character';
			const character = new Fakes.Character({ name: characterName });
			console.log(character);
			const beat = new Beat({ character, text });
			expect(beat.play()).toBe(`${characterName}: ${text}`);
		});
	});
});

