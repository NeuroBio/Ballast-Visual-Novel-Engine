import { NARRATOR } from '../../../../../src/Beat/Beat';
import { FirstFitBranchBeat } from '../../../../../src/Beat/FirstFitBranchBeat';
import { Character } from '../../../../../src/Character/Character';
import { CharacterData } from '../../../FakeData/TestData';

describe(`FirstFitBranchBeat.play`, () => {
	const keyedCharacters = CharacterData.reduce((keyed: { [key: string]: Character}, char) => {
		keyed[char.key] = new Character(char);
		return keyed;
	}, {});
	describe(`all conditions are met`, () => {
		it(`returns the data from the first branch`, () => {
			const firstBranch = { text: 'first', nextBeat: '1' };
			const secondBranch = { text: 'second', nextBeat: '2' };
			const defaultBehavior = { text: 'default', nextBeat: 'an beat' };
			const beat = new FirstFitBranchBeat({
				key: 'key',
				branches: [
					{
						beat: firstBranch,
						conditions: [() => true],
					},
					{
						beat: secondBranch,
						conditions: [() => true],
					},
				],
				defaultBehavior,
			});

			expect(beat.play({ characters: keyedCharacters, inventory: {} })).toEqual({
				text: `${NARRATOR}: ${firstBranch.text}`,
				nextBeat: firstBranch.nextBeat,
			});
		});
	});
	describe(`second branch's condition is met`, () => {
		it(`returns the data from the second branch`, () => {
			const firstBranch = { text: 'first', nextBeat: '1' };
			const secondBranch = { text: 'second', nextBeat: '2' };
			const defaultBehavior = { text: 'default', nextBeat: 'an beat' };
			const beat = new FirstFitBranchBeat({
				key: 'key',
				branches: [
					{
						beat: firstBranch,
						conditions: [() => false],
					},
					{
						beat: secondBranch,
						conditions: [() => true],
					},
				],
				defaultBehavior,
			});

			expect(beat.play({ characters: keyedCharacters, inventory: {} })).toEqual({
				text: `${NARRATOR}: ${secondBranch.text}`,
				nextBeat: secondBranch.nextBeat,
			});
		});
	});
	describe(`no branch's condition is met`, () => {
		it(`returns the default behavior`, () => {
			const firstBranch = { text: 'first', nextBeat: '1' };
			const secondBranch = { text: 'second', nextBeat: '2' };
			const defaultBehavior = { text: 'default', nextBeat: 'an beat' };
			const beat = new FirstFitBranchBeat({
				key: 'key',
				branches: [
					{
						beat: firstBranch,
						conditions: [() => false],
					},
					{
						beat: secondBranch,
						conditions: [() => false],
					},
				],
				defaultBehavior,
			});

			expect(beat.play({ characters: keyedCharacters, inventory: {} })).toEqual({
				text: `${NARRATOR}: ${defaultBehavior.text}`,
				nextBeat: defaultBehavior.nextBeat,
			});
		});
	});
});