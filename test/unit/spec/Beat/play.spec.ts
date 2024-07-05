import { Beat } from '../../../../src/Beat/Beat';

describe('Beat.play', () => {
	it('returns the Beat\'s text and speaker', () => {
		const text = 'Something a character would say';
		const beat = new Beat({ text });
		expect(beat.play()).toBe(`${text}`);
	});
});

