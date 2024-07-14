import { Character } from '../../../../../src/Character/Character';

describe(`Character.removeMemory`, () => {
	it(`adds specified memory to the correct character`, () => {
		const untouchedMemory = 'oldMemory';
		const memory = 'newMemory';
		const character = new Character({
			name: 'some dude',
			key: 'key',
			sentiments: {},
			memories: [ untouchedMemory, memory ],
		});

		character.removeMemory({ memory });
		expect(character.toDto()).toEqual(expect.objectContaining({
			memories: [untouchedMemory],
		}));
	});
});