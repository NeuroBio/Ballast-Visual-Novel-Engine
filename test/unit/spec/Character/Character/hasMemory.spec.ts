import { Character } from '../../../../../src/Character/Character';

describe(`Character.hasMemory`, () => {
	describe(`character has specified memory`, () => {
		it(`returns true`, () => {
			const requestedMemory = 'it was snowing';
			const characterParams = {
				key: 'key',
				name: 'char',
				sentiments: {},
				memories: [requestedMemory],
			};
			const character = new Character(characterParams);
			expect(character.hasMemory(requestedMemory)).toBe(true);
		});
	});
	describe(`character lacks specified memory`, () => {
		it(`returns false`, () => {
			const requestedMemory = 'it was snowing';
			const characterParams = {
				key: 'key',
				name: 'char',
				sentiments: {},
				memories: [],
			};
			const character = new Character(characterParams);
			expect(character.hasMemory(requestedMemory)).toBe(false);
		});
	});
});
