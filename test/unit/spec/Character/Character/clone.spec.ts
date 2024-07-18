import { Character } from '../../../../../src/Character/Character';

describe(`Character.c,one`, () => {
	it(`returns a cloned character`, () => {
		const key = 'key';
		const name = 'char';
		const traits = { feeling: 0 };
		const memories = ['shinyTrees'];
		const characterParams = {
			key,
			name,
			traits,
			memories,
		};
		const character = new Character(characterParams);
		const clone = character.clone();
		expect(clone instanceof Character).toBe(true);
		const dto = clone.toDto();
		expect(dto).toEqual(characterParams);
		expect(dto.memories).not.toBe(memories);
		expect(dto.traits).not.toBe(traits);
	});
});
