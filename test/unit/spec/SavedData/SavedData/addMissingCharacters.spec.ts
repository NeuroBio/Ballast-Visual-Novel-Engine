import { CharacterDto } from '../../../../../src/Character/Character';
import { SavedData } from '../../../../../src/SavedData/SavedData';
import { CharacterTemplateData } from '../../../FakeData/TestData';

describe(`SaveData.toDto`, () => {
	describe(`all characters already in save data`, () => {
		it(`changes nothing`, () => {
			const characters: CharacterDto[] = [
				{
					key: 'test',
					name: 'tester-y',
					sentiments: {},
					memories: ['originalData'],
				},
				{
					key: 'test2',
					name: 'tester-y 2',
					sentiments: {},
					memories: ['originalData'],

				},
			];
			const savedDataParams = {
				activeChapters: {},
				unlockedChapters: [],
				completedChapters: [],
				inventory: {},
				achievements: [],
				characters,
			};
			const savedData = new SavedData(savedDataParams);
			savedData.addMissingCharacters(CharacterTemplateData);

			expect(savedData.toDto().characters).toEqual(characters);
		});
	});
	describe(`some characters already in save data`, () => {
		it(`adds only the missing characters`, () => {
			const characters: CharacterDto[] = [
				{
					key: 'test',
					name: 'tester-y',
					sentiments: {},
					memories: ['originalData'],
				},
			];
			const savedDataParams = {
				activeChapters: {},
				unlockedChapters: [],
				completedChapters: [],
				inventory: {},
				achievements: [],
				characters,
			};
			const savedData = new SavedData(savedDataParams);
			savedData.addMissingCharacters(CharacterTemplateData);

			expect(savedData.toDto().characters).toEqual([
				characters[0],
				{ ...CharacterTemplateData[1], memories: [] },
			]);
		});
	});
	describe(`no characters already in save data`, () => {
		it(`adds all characters`, () => {
			const characters: CharacterDto[] = [];
			const savedDataParams = {
				activeChapters: {},
				unlockedChapters: [],
				completedChapters: [],
				inventory: {},
				achievements: [],
				characters,
			};
			const savedData = new SavedData(savedDataParams);
			savedData.addMissingCharacters(CharacterTemplateData);

			expect(savedData.toDto().characters).toEqual([
				{ ...CharacterTemplateData[0], memories: [] },
				{ ...CharacterTemplateData[1], memories: [] },
			]);
		});
	});
});
