import { Character } from '../../../../../src/Character/Character';

describe(`Character.toDto`, () => {
	it(`returns a character dto`, () => {
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
		const dto = character.toDto();
		expect(dto).toEqual(characterParams);
		expect(dto.memories).not.toBe(memories);
		expect(dto.traits).not.toBe(traits);
	});
});
