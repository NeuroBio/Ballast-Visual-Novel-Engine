import { SavedDataRepo } from '../../../../../src/SavedData/SaveDataRepo';
import { SavedData } from '../../../../../src/SavedData/SavedData';
import { SavedDataData } from '../../../FakeData/TestData';

describe(`SavedDataRepo.autosave`, () => {
	describe(`custom autosave not passed`, () => {
		it(`saves the data with the function for manual saves`, async () => {
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
			});

			savedDataRepo.autosave(savedData);
			expect(saveData).toHaveBeenCalledWith(savedData.toDto());
		});
	});
	describe(`custom autosave was passed`, () => {
		it(`saves the data with the function for autosaves`, async () => {
			const saveData = jest.fn();
			const autosaveData = jest.fn();
			const savedDataRepo = new SavedDataRepo({
				findData: () => Promise.resolve(SavedDataData),
				saveData,
				autosaveData,
			});

			const savedData = new SavedData({
				activeChapters: { second: 'someScene' },
				unlockedChapters: ['second'],
				completedChapters: ['first'],
				inventory: { item: 3 },
				achievements: ['achieve'],
			});

			savedDataRepo.autosave(savedData);
			expect(autosaveData).toHaveBeenCalledWith(savedData.toDto());
		});
	});
});
