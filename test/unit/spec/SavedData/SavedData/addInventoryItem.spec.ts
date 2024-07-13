import { SavedData } from '../../../../../src/SavedData/SavedData';

describe(`SaveData.addInventoryItem`, () => {
	describe(`inventory item is not already in inventory`, () => {
		it(`adds the correct item with the correct amount`, () => {
			const itemKey = 'item';
			const quantity = 3;
			const savedData = new SavedData({
				activeChapters: { },
				unlockedChapters: [],
				completedChapters: [],
				inventory: {},
				achievements: [],
			});

			savedData.addInventoryItem({ key: itemKey, quantity });
			expect(savedData.toDto()).toEqual(expect.objectContaining({
				inventory: { [itemKey]: quantity },
			}));
		});
	});
	describe(`inventory item is already in inventory`, () => {
		it(`adds the correct amount to the correct item`, () => {
			const itemKey = 'item';
			const originalQuantity = 5;
			const quantity = 3;
			const savedData = new SavedData({
				activeChapters: { },
				unlockedChapters: [],
				completedChapters: [],
				inventory: { [itemKey]: originalQuantity },
				achievements: [],
			});

			savedData.addInventoryItem({ key: itemKey, quantity });
			expect(savedData.toDto()).toEqual(expect.objectContaining({
				inventory: { [itemKey]: quantity + originalQuantity },
			}));
		});
	});
});