import { Character } from '../../../../../src/Character/Character';

describe(`Character.updateSentiment`, () => {
	describe(`
		sentiment is increasing
		sentiment exists in data
	`, () => {
		it(`adds specified memory to the correct character`, () => {
			const sentiment = 'like-ity-ness';
			const originalValue = 0.009;
			const change = 0.001;
			const character = new Character({
				name: 'some dude',
				key: 'key',
				sentiments: { [sentiment]: originalValue },
				memories: [ ],
			});

			character.updateSentiment({ sentiment, change });
			expect(character.toDto()).toEqual(expect.objectContaining({
				sentiments: { [sentiment]: 0.010 },
			}));
		});
	});
	describe(`
		sentiment is decreasing
		sentiment exists in data
	`, () => {
		it(`adds specified memory to the correct character`, () => {
			const sentiment = 'like-ity-ness';
			const originalValue = 0.009;
			const change = -0.001;
			const character = new Character({
				name: 'some dude',
				key: 'key',
				sentiments: { [sentiment]: originalValue },
				memories: [ ],
			});

			character.updateSentiment({ sentiment, change });
			expect(character.toDto()).toEqual(expect.objectContaining({
				sentiments: { [sentiment]: 0.008 },
			}));
		});
	});
	describe(`
		sentiment is decreasing
		sentiment does not exist in data
	`, () => {
		it(`adds specified memory to the correct character`, () => {
			const sentiment = 'like-ity-ness';
			const change = -0.001;
			const character = new Character({
				name: 'some dude',
				key: 'key',
				sentiments: {},
				memories: [ ],
			});

			character.updateSentiment({ sentiment, change });
			expect(character.toDto()).toEqual(expect.objectContaining({
				sentiments: { [sentiment]: -0.001 },
			}));
		});
	});
	describe(`
		sentiment is increasing
		sentiment does not exist in data
	`, () => {
		it(`adds specified memory to the correct character`, () => {
			const sentiment = 'like-ity-ness';
			const change = 0.001;
			const character = new Character({
				name: 'some dude',
				key: 'key',
				sentiments: {},
				memories: [ ],
			});

			character.updateSentiment({ sentiment, change });
			expect(character.toDto()).toEqual(expect.objectContaining({
				sentiments: { [sentiment]: 0.001 },
			}));
		});
	});
});