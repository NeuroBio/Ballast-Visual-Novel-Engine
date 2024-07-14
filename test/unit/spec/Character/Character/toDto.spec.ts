import { Character } from '../../../../../src/Character/Character';

describe(`Character.toDto`, () => {
	it(`returns a character dto`, () => {
		const key = 'key';
		const name = 'char';
		const sentiments = { feeling: 0 };
		const memories = ['shinyTrees'];
		const characterParams = {
			key,
			name,
			sentiments,
			memories,
		};
		const character = new Character(characterParams);
		const dto = character.toDto();
		expect(dto).toEqual(characterParams);
		expect(dto.memories).not.toBe(memories);
		expect(dto.sentiments).not.toBe(sentiments);
	});
});