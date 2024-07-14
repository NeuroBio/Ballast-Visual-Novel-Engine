import { Character } from '../../../../../src/Character/Character';

describe(`Character.addMemory`, () => {
	it(`adds specified memory to the correct character`, () => {
		const oldMemory = 'oldMemory';
		const memory = 'newMemory';
		const character = new Character({
			name: 'some dude',
			key: 'key',
			sentiments: {},
			memories: [ oldMemory ],
		});

		character.addMemory({ memory });
		expect(character.toDto()).toEqual(expect.objectContaining({
			memories: [oldMemory, memory],
		}));
	});
});