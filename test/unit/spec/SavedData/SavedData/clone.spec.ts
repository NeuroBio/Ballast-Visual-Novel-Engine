import { SavedData } from '../../../../../src/SavedData/SavedData';

describe(`SavedData.clone`, () => {
	it(`returns an identical instance of itself.`, () => {
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

		const clone = savedData.clone();
		expect(clone instanceof SavedData).toBe(true);
		const dto = clone.toDto();
		expect(dto).toEqual(savedDataParams);
	});
});