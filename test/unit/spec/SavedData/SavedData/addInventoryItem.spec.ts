import { SavedData } from '../../../../../src/SavedData/SavedData';

describe(`SaveData.addInventoryItem`, () => {
	describe(`inventory item is not already in inventory`, () => {
		it(`adds the correct item with the correct amount`, () => {
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

			savedData.addInventoryItem({ item, quantity });
			expect(savedData.toDto()).toEqual(expect.objectContaining({
				inventory: { [item]: quantity },
			}));
		});
	});
	describe(`inventory item is already in inventory`, () => {
		it(`adds the correct amount to the correct item`, () => {
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

			savedData.addInventoryItem({ item, quantity });
			expect(savedData.toDto()).toEqual(expect.objectContaining({
				inventory: { [item]: quantity + originalQuantity },
			}));
		});
	});
});