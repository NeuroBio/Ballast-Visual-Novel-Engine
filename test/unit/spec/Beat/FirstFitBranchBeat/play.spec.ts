import { NARRATOR } from '../../../../../src/Beat/Beat';
import { FirstFitBranchBeat } from '../../../../../src/Beat/FirstFitBranchBeat';
import { Character } from '../../../../../src/Character/Character';
import { CharacterData } from '../../../FakeData/TestData';

describe(`FirstFitBranchBeat.play`, () => {
	const keyedCharacters = CharacterData.reduce((keyed: { [key: string]: Character}, char) => {
		keyed[char.key] = new Character({ ...char, memories: [] });
		return keyed;
	}, {});
	const saveData = Object.freeze({
		queuedScenes: [],
		unlockedChapters: [],
		unlockedAchievements: [],
		addedItems: [],
		removedItems: [],
		addedMemories: [],
		removedMemories: [],
		updatedCharacterTraits: [],
	});
	const sceneData = Object.freeze({
		setBackground: '',
		updateCharacterSprites: [],
		moveCharacters: [],
		removeCharacters: [],
		addCharacters: [],
	});

	describe(`all conditions are met`, () => {
		it(`returns the data from the first branch`, () => {
			const firstBranch = { text: 'first', nextBeat: '1', sceneData };
			const secondBranch = { text: 'second', nextBeat: '2', sceneData };
			const defaultBehavior = { text: 'default', nextBeat: 'an beat', sceneData };
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
				saveData,
			});

			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: firstBranch.text,
				nextBeat: firstBranch.nextBeat,
				speaker: NARRATOR,
				saveData: expect.any(Object),
				sceneData: expect.any(Object),
			});
		});
	});
	describe(`second branch's condition is met`, () => {
		it(`returns the data from the second branch`, () => {
			const firstBranch = { text: 'first', nextBeat: '1', sceneData };
			const secondBranch = { text: 'second', nextBeat: '2', sceneData };
			const defaultBehavior = { text: 'default', nextBeat: 'an beat', sceneData };
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
				saveData,
			});

			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: secondBranch.text,
				nextBeat: secondBranch.nextBeat,
				speaker: NARRATOR,
				saveData: expect.any(Object),
				sceneData: expect.any(Object),
			});
		});
	});
	describe(`no branch's condition is met`, () => {
		it(`returns the default behavior`, () => {
			const firstBranch = { text: 'first', nextBeat: '1', sceneData };
			const secondBranch = { text: 'second', nextBeat: '2', sceneData };
			const defaultBehavior = { text: 'default', nextBeat: 'an beat', sceneData };
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
				saveData,
			});

			expect(beat.play({
				characters: keyedCharacters,
				inventory: {},
				scene: { characters: new Set() },
			})).toEqual({
				text: defaultBehavior.text,
				nextBeat: defaultBehavior.nextBeat,
				speaker: NARRATOR,
				saveData: expect.any(Object),
				sceneData: expect.any(Object),
			});
		});
	});
});