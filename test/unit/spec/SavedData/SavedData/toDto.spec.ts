import { SavedData } from '../../../../../src/SavedData/SavedData';

describe(`SaveData.toDto`, () => {
	it(`returns a save data dto`, () => {
		const activeChapters = { currentChapter: 'queued' };
		const unlockedChapters = ['currentChapter'];
		const completedChapters = ['priorChapter'];
		const inventory = { someItem: 3 };
		const achievements = [ 'achieve1', 'achieve2'];
		const savedDataParams = {
			activeChapters,
			unlockedChapters,
			completedChapters,
			inventory,
			achievements,
		};
		const savedData = new SavedData(savedDataParams);

		const dto = savedData.toDto();
		expect(dto).toEqual(savedDataParams);
		// not by reference
		expect(dto.activeChapters).not.toBe(activeChapters);
		expect(dto.completedChapters).not.toBe(completedChapters);
		expect(dto.unlockedChapters).not.toBe(unlockedChapters);
		expect(dto.inventory).not.toBe(inventory);
		expect(dto.achievements).not.toBe(achievements);
	});
});
