import { CharacterTemplateFinder } from '../../../../../src/Character/CharacterTemplateFinder';
import { CharacterTemplateData } from '../../../../fake-data/TestData';

describe(`CharacterTemplateFinder.all`, () => {
	it(`loads all characters from data`, async () => {
		const characterTemplateFinder = new CharacterTemplateFinder({
			findData: () => Promise.resolve(CharacterTemplateData),
		});
		const characters = await characterTemplateFinder.all();
		expect(characters[0]).toEqual(CharacterTemplateData[0]);
		expect(characters[1]).toEqual(CharacterTemplateData[1]);
	});
});
