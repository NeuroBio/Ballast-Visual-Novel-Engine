import { SavedData } from '../../../../../src/SavedData/SavedData';

describe(`SaveData.addMemoryToCharacter`, () => {
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

			expect(() => savedData.addMemoryToCharacter({ character, memory }))
				.toThrow(Error.NO_CHAR);
		});
	});
	describe(`character is in save data`, () => {
		it(`adds specified memory to the correct character`, () => {
			const character = 'char';
			const oldMemory = 'oldMemory';
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
					sentiments: {},
					memories: [ oldMemory ],
				}],
			});

			savedData.addMemoryToCharacter({ character, memory });
			expect(savedData.toDto()).toEqual(expect.objectContaining({
				characters: expect.arrayContaining([
					expect.objectContaining({ memories: [oldMemory, memory] }),
				]),
			}));
		});
	});
});