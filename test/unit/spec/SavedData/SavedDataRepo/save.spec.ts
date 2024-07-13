import { SavedDataRepo } from '../../../../../src/SavedData/SaveDataRepo';
import { SavedData } from '../../../../../src/SavedData/SavedData';
import { SavedDataData } from '../../../FakeData/TestData';

describe(`SavedDataRepo.save`, () => {
	it(`saves the data with the custom function`, async () => {
		const saveData = jest.fn();
		const savedDataRepo = new SavedDataRepo({
			findData: () => Promise.resolve(SavedDataData),
			saveData,
		});

		const savedData = new SavedData({
			activeChapters: { second: 'someScene' },
			unlockedChapters: ['second'],
			completedChapters: ['first'],
			inventory: { item: 3 },
			achievements: ['achieve'],
			characters: [],
		});

		savedDataRepo.save(savedData);
		expect(saveData).toHaveBeenCalledWith(savedData.toDto());
	});
});
