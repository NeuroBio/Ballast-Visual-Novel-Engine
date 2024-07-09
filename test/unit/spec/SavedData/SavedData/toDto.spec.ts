import { SavedData } from '../../../../../src/SavedData/SavedData';

describe(`SaveData.toDto`, () => {
	it(`returns a save data dto`, () => {
		const priorChapterKey = 'firstChapter';
		const priorSceneKey = 'firstScene';
		const currentChapterKey = 'current chapter';
		const currentSceneKey = 'current scene';
		const achievementKeys = ['achieve 1', 'achieve 2'];
		const completedChapterKeys = [ priorChapterKey ];
		const savedDataParams = {
			priorChapterKey,
			priorSceneKey,
			currentChapterKey,
			currentSceneKey,
			achievementKeys,
			completedChapterKeys,
		};
		const savedData = new SavedData({
			priorChapterKey,
			priorSceneKey,
			currentChapterKey,
			currentSceneKey,
			achievementKeys,
			completedChapterKeys,
		});

		const dto = savedData.toDto();
		expect(dto).toEqual(savedDataParams);
		expect(dto.achievementKeys).not.toBe(achievementKeys);
		expect(dto.completedChapterKeys).not.toBe(completedChapterKeys);
	});
});
