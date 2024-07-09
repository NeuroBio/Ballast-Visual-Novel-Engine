import { SavedDataRepo } from '../../../../../src/SavedData/SaveDataRepo';
import { SavedData } from '../../../../../src/SavedData/SavedData';
import { SavedDataData } from '../../../FakeData/TestData';

describe(`SavedDataRepo.upsert`, () => {
	it(`upserts the data with the custom function`, async () => {
		const saveData = jest.fn();
		const savedDataRepo = new SavedDataRepo({
			findData: () => Promise.resolve(SavedDataData),
			saveData,
		});

		const savedData = new SavedData({
			priorChapterKey: '',
			priorSceneKey: '',
			currentChapterKey: 'chap',
			currentSceneKey: 'scene',
			achievementKeys: [],
			completedChapterKeys: ['chap'],
		});

		savedDataRepo.upsert(savedData);
		expect(saveData).toHaveBeenCalledWith(savedData.toDto());
	});
});