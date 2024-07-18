import { Character } from '../../../../../src/Character/Character';

describe(`Character.updateTrait`, () => {
	describe(`
		trait is increasing
		trait exists in data
	`, () => {
		it(`adds specified memory to the correct character`, () => {
			const trait = 'like-ity-ness';
			const originalValue = 0.009;
			const change = 0.001;
			const character = new Character({
				name: 'some dude',
				key: 'key',
				traits: { [trait]: originalValue },
				memories: [ ],
			});

			character.updateTrait({ trait, change });
			expect(character.toDto()).toEqual(expect.objectContaining({
				traits: { [trait]: 0.010 },
			}));
		});
	});
	describe(`
		trait is decreasing
		trait exists in data
	`, () => {
		it(`adds specified memory to the correct character`, () => {
			const trait = 'like-ity-ness';
			const originalValue = 0.009;
			const change = -0.001;
			const character = new Character({
				name: 'some dude',
				key: 'key',
				traits: { [trait]: originalValue },
				memories: [ ],
			});

			character.updateTrait({ trait, change });
			expect(character.toDto()).toEqual(expect.objectContaining({
				traits: { [trait]: 0.008 },
			}));
		});
	});
	describe(`
		trait is decreasing
		trait does not exist in data
	`, () => {
		it(`adds specified memory to the correct character`, () => {
			const trait = 'like-ity-ness';
			const change = -0.001;
			const character = new Character({
				name: 'some dude',
				key: 'key',
				traits: {},
				memories: [ ],
			});

			character.updateTrait({ trait, change });
			expect(character.toDto()).toEqual(expect.objectContaining({
				traits: { [trait]: -0.001 },
			}));
		});
	});
	describe(`
		trait is increasing
		trait does not exist in data
	`, () => {
		it(`adds specified memory to the correct character`, () => {
			const trait = 'like-ity-ness';
			const change = 0.001;
			const character = new Character({
				name: 'some dude',
				key: 'key',
				traits: {},
				memories: [ ],
			});

			character.updateTrait({ trait, change });
			expect(character.toDto()).toEqual(expect.objectContaining({
				traits: { [trait]: 0.001 },
			}));
		});
	});
});