import { NARRATOR } from '../../../../../src/Beat/Beat';
import { Character } from '../../../../../src/Character/Character';
import { CharacterData } from '../../../FakeData/TestData';

describe(`FirstFitBranchBeat.play`, () => {
	const keyedCharacters = CharacterData.reduce((keyed: { [key: string]: Character}, char) => {
		keyed[char.key] = new Character(char);
		return keyed;
	}, {});
	describe(`first branch's condition is met`, () => {
		it(`returns the data from the first branch`, () => {

		});
	});
	describe(`second branch's condition is met`, () => {
		it(`returns the data from the second branch`, () => {

		});
	});
	describe(`no branch's condition is met`, () => {
		it(`returns the default behavior`, () => {

		});
	});
});