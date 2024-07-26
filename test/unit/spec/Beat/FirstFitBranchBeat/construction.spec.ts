import { FirstFitBranchBeat } from '../../../../../src/Beat/FirstFitBranchBeat';

describe(`FirstFitBranchBeat.construction`, () => {
	const Error = Object.freeze({
		NO_BRANCHING: 'Branch Beats require at least 1 branch.',
		CANNOT_BRANCH: 'When no branches are conditional, data should be formatted as a Simple Beat, not a Branch Beat.',
		REQUIRE_CONDITIONS: 'All branches in a First Fit Branch Beat should be conditional.',
	});
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

	describe(`constructed with no branches`, () => {
		it(`throws an error`, () => {
			expect(() => new FirstFitBranchBeat({
				key: 'key',
				branches: [],
				defaultBehavior: { text: '', nextBeat: '', sceneData },
				saveData,
			})).toThrow(Error.NO_BRANCHING);
		});
	});
	describe(`constructed with multiple branches none of which are conditional`, () => {
		it(`throws an error`, () => {
			expect(() => new FirstFitBranchBeat({
				key: 'key',
				branches: [
					{
						beat: { text: '', nextBeat: '', sceneData },
						conditions: [],
					},
					{
						beat: { text: '', nextBeat: '', sceneData },
						conditions: [],
					},
				],
				defaultBehavior: { text: '', nextBeat: '', sceneData },
				saveData,
			})).toThrow(Error.CANNOT_BRANCH);
		});
	});
	describe(`constructed with multiple branches some of which are conditional`, () => {
		it(`throws an error`, () => {
			expect(() => new FirstFitBranchBeat({
				key: 'key',
				branches: [
					{
						beat: { text: '', nextBeat: '', sceneData },
						conditions: [],
					},
					{
						beat: { text: '', nextBeat: '', sceneData },
						conditions: [() => true],
					},
				],
				defaultBehavior: { text: '', nextBeat: '', sceneData },
				saveData,
			})).toThrow(Error.REQUIRE_CONDITIONS);
		});
	});
	describe(`
		constructed with multiple branches all of which are conditional
		and a default behavior
	`, () => {
		it(`creates a valid beat`, () => {
			const beat = new FirstFitBranchBeat({
				key: 'key',
				branches: [
					{
						beat: { text: '', nextBeat: '', sceneData },
						conditions: [() => true],
					},
					{
						beat: { text: '', nextBeat: '', sceneData },
						conditions: [() => true],
					},
				],
				defaultBehavior: { text: '', nextBeat: '', sceneData },
				saveData,
			});

			expect(beat instanceof FirstFitBranchBeat).toBe(true);
		});
	});
});