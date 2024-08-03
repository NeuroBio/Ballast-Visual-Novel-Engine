import { SavedDataRepo } from '../../../../../src/SavedData/SaveDataRepo';
import { SavedData } from '../../../../../src/SavedData/SavedData';
import { SavedDataData } from '../../../../fake-data/TestData';;

describe(`SavedDataRepo.findOrCreate`, () => {
	describe(`requesting valid save data`, () => {
		it(`returns the saveData`, async () => {
			const savedDataRepo = new SavedDataRepo({
				findData: () => Promise.resolve(SavedDataData),
				saveData: () => Promise.resolve(),
			});

			const result = await savedDataRepo.findOrCreate();
			expect(result instanceof SavedData).toBe(true);
		});
	});
	describe(`requesting nonexistent save data, using default create`, () => {
		it(`returns the saveData`, async () => {
			const savedDataRepo = new SavedDataRepo({
				findData: () => Promise.resolve(),
				saveData: () => Promise.resolve(),
			});

			const result = await savedDataRepo.findOrCreate();
			expect(result instanceof SavedData).toBe(true);
		});
	});
	describe(`requesting nonexistent save data, using custom create`, () => {
		const createData = jest.fn();
		let result: any;
		beforeAll(async () => {
			createData.mockReturnValueOnce(Promise.resolve(SavedDataData));
			const savedDataRepo = new SavedDataRepo({
				findData: () => Promise.resolve(),
				saveData: () => Promise.resolve(),
				createData,
			});

			result = await savedDataRepo.findOrCreate();
		});
		it(`returns the saveData`, async () => {
			expect(result instanceof SavedData).toBe(true);
		});
		it(`calls the custom create function`, async () => {
			expect(createData).toHaveBeenCalled();
		});
	});
});
