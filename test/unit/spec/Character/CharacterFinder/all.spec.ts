import { Character } from '../../../../../src/Character/Character';
import { CharacterFinder } from '../../../../../src/Character/CharacterFinder';
import { CharacterData } from '../../../FakeData/TestData';

describe(`CharacterFinder.all`, () => {
	it(`loads all characters from data`, async () => {
		const characterFinder = new CharacterFinder({
			findData: () => Promise.resolve(CharacterData),
		});
		const chapters = await characterFinder.all();
		expect(chapters[0] instanceof Character).toBe(true);
		expect(chapters[1] instanceof Character).toBe(true);
	});
});
