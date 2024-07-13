import { SavedData } from '../../../../../src/SavedData/SavedData';

describe(`SaveData.removeInventoryItem`, () => {
	describe(`
		inventory item is already in inventory
		and removed qty is less than the quantity in inventory
	`, () => {
		it(`removes the correct amount to the correct item`, () => {
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

			savedData.removeInventoryItem({ key: itemKey, quantity });
			expect(savedData.toDto()).toEqual(expect.objectContaining({
				inventory: { [itemKey]: originalQuantity - quantity },
			}));
		});
	});
	describe(`
		inventory item is already in inventory
		and removed qty is equal to the quantity in inventory
	`, () => {
		it(`removes the item`, () => {
			const itemKey = 'item';
			const originalQuantity = 5;
			const quantity = originalQuantity;
			const savedData = new SavedData({
				activeChapters: { },
				unlockedChapters: [],
				completedChapters: [],
				inventory: { [itemKey]: originalQuantity },
				achievements: [],
			});

			savedData.removeInventoryItem({ key: itemKey, quantity });
			expect(savedData.toDto()).toEqual(expect.objectContaining({
				inventory: { },
			}));
		});
	});
	describe(`
		inventory item is already in inventory
		and removed qty is greater than the quantity in inventory
	`, () => {
		it(`removes the item`, () => {
			const itemKey = 'item';
			const originalQuantity = 5;
			const quantity = originalQuantity + 1;
			const savedData = new SavedData({
				activeChapters: { },
				unlockedChapters: [],
				completedChapters: [],
				inventory: { [itemKey]: originalQuantity },
				achievements: [],
			});

			savedData.removeInventoryItem({ key: itemKey, quantity });
			expect(savedData.toDto()).toEqual(expect.objectContaining({
				inventory: { },
			}));
		});
	});
	describe(`inventory item is not already in inventory`, () => {
		it(`does nothing`, () => {
			const itemKey = 'item';
			const quantity = 3;
			const savedData = new SavedData({
				activeChapters: { },
				unlockedChapters: [],
				completedChapters: [],
				inventory: {},
				achievements: [],
			});

			savedData.removeInventoryItem({ key: itemKey, quantity });
			expect(savedData.toDto()).toEqual(expect.objectContaining({
				inventory: { },
			}));
		});
	});
});