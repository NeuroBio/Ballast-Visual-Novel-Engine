import { SavedData } from '../../../../../src/SavedData/SavedData';

describe(`SaveData.updateCharacterTrait`, () => {
	const Error = {
		NO_CHAR: 'Cannot modify data for unknown characters.',
	};
	describe(`character is not in save data`, () => {
		it(`throws error`, () => {
			const character = 'char';
			const trait = 'like-ity-ness';
			const change = 0.001;
			const savedData = new SavedData({
				activeChapters: { },
				unlockedChapters: [],
				completedChapters: [],
				inventory: {},
				achievements: [],
				characters: [],
			});

			expect(() => savedData.updateCharacterTrait({ character, trait, change }))
				.toThrow(Error.NO_CHAR);
		});
	});
	describe(`
		character is in save data
		trait exists in data
	`, () => {
		it(`increases specified trait the correct amount for the correct character`, () => {
			const character = 'char';
			const trait = 'like-ity-ness';
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
					traits: {
						[trait]: originalValue,
					},
					memories: [],
				}],
			});

			savedData.updateCharacterTrait({ character, trait, change });
			expect(savedData.toDto()).toEqual(expect.objectContaining({
				characters: expect.arrayContaining([
					expect.objectContaining({ traits: { [trait]: 0.010 } }),
				]),
			}));
		});
	});
	describe(`
		character is in save data
		trait does not exist in data
	`, () => {
		it(`sets specified trait to the correct amount for the correct character`, () => {
			const character = 'char';
			const trait = 'like-ity-ness';
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
					traits: {},
					memories: [],
				}],
			});

			savedData.updateCharacterTrait({ character, trait, change });
			expect(savedData.toDto()).toEqual(expect.objectContaining({
				characters: expect.arrayContaining([
					expect.objectContaining({ traits: { [trait]: 0.001 } }),
				]),
			}));
		});
	});
});
