import { SavedData } from '../../../../../src/SavedData/SavedData';

describe(`SaveData.unlockAchievement`, () => {
	it(`adds the achievement to the achievement list`, () => {
		const savedData = new SavedData({
			activeChapters: { },
			unlockedChapters: [],
			completedChapters: [],
			inventory: {},
			achievements: [],
		});
		const newAchievement = 'new';

		savedData.unlockAchievement(newAchievement);
		expect(savedData.toDto()).toEqual(expect.objectContaining({
			achievements: [newAchievement],
		}));
	});
});