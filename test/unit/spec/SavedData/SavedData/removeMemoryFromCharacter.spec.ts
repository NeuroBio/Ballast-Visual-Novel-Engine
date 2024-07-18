import { SavedData } from '../../../../../src/SavedData/SavedData';

describe(`SaveData.removeMemoryFromCharacter`, () => {
	const Error = {
		NO_CHAR: 'Cannot modify data for unknown characters.',
	};
	describe(`character is not in save data`, () => {
		it(`throws error`, () => {
			const character = 'char';
			const memory = 'newMemory';
			const savedData = new SavedData({
				activeChapters: { },
				unlockedChapters: [],
				completedChapters: [],
				inventory: {},
				achievements: [],
				characters: [],
			});

			expect(() => savedData.removeMemoryFromCharacter({ character, memory }))
				.toThrow(Error.NO_CHAR);
		});
	});
	describe(`character is in save data`, () => {
		it(`removes specified memory from the correct character`, () => {
			const character = 'char';
			const untouchedMemory = 'oldMemory';
			const memory = 'newMemory';
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
					memories: [ untouchedMemory, memory ],
				}],
			});

			savedData.removeMemoryFromCharacter({ character, memory });
			expect(savedData.toDto()).toEqual(expect.objectContaining({
				characters: expect.arrayContaining([
					expect.objectContaining({ memories: [untouchedMemory] }),
				]),
			}));
		});
	});
});