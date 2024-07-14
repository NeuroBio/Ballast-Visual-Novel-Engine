import { SavedData } from '../../../../../src/SavedData/SavedData';

describe(`SaveData.updateCharacterSentiment`, () => {
	const Error = {
		NO_CHAR: 'Cannot modify data for unknown characters.',
	};
	describe(`character is not in save data`, () => {
		it(`throws error`, () => {
			const character = 'char';
			const sentiment = 'like-ity-ness';
			const change = 0.001;
			const savedData = new SavedData({
				activeChapters: { },
				unlockedChapters: [],
				completedChapters: [],
				inventory: {},
				achievements: [],
				characters: [],
			});

			expect(() => savedData.updateCharacterSentiment({ character, sentiment, change }))
				.toThrow(Error.NO_CHAR);
		});
	});
	xdescribe(`
		character is in save data
		sentiment is increasing
		sentiment exists in data
	`, () => {
		it(`increases specified sentiment the correct amount for the correct character`, () => {
			const character = 'char';
			const sentiment = 'like-ity-ness';
			const originalValue = 0.009;
			const change = 0.001;
			const savedData = new SavedData({
				activeChapters: { },
				unlockedChapters: [],
				completedChapters: [],
				inventory: {},
				achievements: [],
				characters: [{
					name: 'some dude',
					key: character,
					sentiments: {
						[sentiment]: originalValue,
					},
					memories: [],
				}],
			});

			savedData.updateCharacterSentiment({ character, sentiment, change });
			expect(savedData.toDto()).toEqual(expect.objectContaining({
				characters: expect.arrayContaining([
					expect.objectContaining({ sentiment: { [sentiment]: change + originalValue } }),
				]),
			}));
		});
	});
});
