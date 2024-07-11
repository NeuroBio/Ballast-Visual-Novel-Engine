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
		expect(dto.achievements).not.toBe(achievements);
		expect(dto.completedChapters).not.toBe(completedChapters);
	});
});
