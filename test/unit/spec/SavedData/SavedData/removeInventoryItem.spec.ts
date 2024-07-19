import { SavedData } from '../../../../../src/SavedData/SavedData';

describe(`SaveData.removeInventoryItem`, () => {
	describe(`
		inventory item is already in inventory
		and removed qty is less than the quantity in inventory
	`, () => {
		it(`removes the correct amount to the correct item`, () => {
			const item = 'item';
			const originalQuantity = 5;
			const quantity = 3;
			const savedData = new SavedData({
				activeChapters: { },
				unlockedChapters: [],
				completedChapters: [],
				inventory: { [item]: originalQuantity },
				achievements: [],
				characters: [],
			});

			savedData.removeInventoryItem({ item, quantity });
			expect(savedData.toDto()).toEqual(expect.objectContaining({
				inventory: { [item]: originalQuantity - quantity },
			}));
		});
	});
	describe(`
		inventory item is already in inventory
		and removed qty is equal to the quantity in inventory
	`, () => {
		it(`removes the item`, () => {
			const item = 'item';
			const originalQuantity = 5;
			const quantity = originalQuantity;
			const savedData = new SavedData({
				activeChapters: { },
				unlockedChapters: [],
				completedChapters: [],
				inventory: { [item]: originalQuantity },
				achievements: [],
				characters: [],
			});

			savedData.removeInventoryItem({ item, quantity });
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
			const item = 'item';
			const originalQuantity = 5;
			const quantity = originalQuantity + 1;
			const savedData = new SavedData({
				activeChapters: { },
				unlockedChapters: [],
				completedChapters: [],
				inventory: { [item]: originalQuantity },
				achievements: [],
				characters: [],
			});

			savedData.removeInventoryItem({ item, quantity });
			expect(savedData.toDto()).toEqual(expect.objectContaining({
				inventory: { },
			}));
		});
	});
	describe(`inventory item is not already in inventory`, () => {
		it(`does nothing`, () => {
			const item = 'item';
			const quantity = 3;
			const savedData = new SavedData({
				activeChapters: { },
				unlockedChapters: [],
				completedChapters: [],
				inventory: {},
				achievements: [],
				characters: [],
			});

			savedData.removeInventoryItem({ item, quantity });
			expect(savedData.toDto()).toEqual(expect.objectContaining({
				inventory: { },
			}));
		});
	});
});