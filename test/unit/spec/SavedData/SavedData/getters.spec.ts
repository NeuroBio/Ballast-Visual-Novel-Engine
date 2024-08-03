import { Character } from '../../../../../src/Character/Character';
import { SavedData } from '../../../../../src/SavedData/SavedData';

describe(`SaveData getters`, () => {
	const saveDataParams = {
		activeChapters: { },
		unlockedChapters: [],
		completedChapters: [ '1', '2', '3'],
		inventory: { someItem: 3 },
		achievements: [ 'A', 'B', 'C' ],
		characters: [{
			key: 'test',
			name: 'tester-y',
			traits: {},
			memories: ['originalData'],
		}],
	};
	const saveData = new SavedData(saveDataParams);
	describe(`characters`, () => {
		it(`returns the expected data`, () => {
			expect(saveData.characters).toEqual({
				[saveDataParams.characters[0].key]: new Character(saveDataParams.characters[0]),
			});
		});
	});
	describe(`achievementKeys`, () => {
		it(`returns the expected data`, () => {
			expect(saveData.achievementKeys).toEqual(saveDataParams.achievements);
		});
	});
	describe(`completedChaptersKeys`, () => {
		it(`returns the expected data`, () => {
			expect(saveData.completedChaptersKeys).toEqual(saveDataParams.completedChapters);
		});
	});
	describe(`inventory`, () => {
		it(`returns the expected data`, () => {
			expect(saveData.inventory).toEqual(saveDataParams.inventory);
		});
	});
});