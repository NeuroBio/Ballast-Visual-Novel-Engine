import { FirstFitBranchBeat } from '../../../../../src/Beat/FirstFitBranchBeat';

describe(`FirstFitBranchBeat.nextBeats`, () => {
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
	it(`returns all viable nextBeats`, () => {
		const beat = new FirstFitBranchBeat({
			key: 'key',
			branches: [
				{
					beat: { text: '', nextBeat: '1', sceneData },
					conditions: [() => true],
				},
				{
					beat: { text: '', nextBeat: '2', sceneData },
					conditions: [() => true],
				},
			],
			defaultBehavior: { text: '', nextBeat: '3', sceneData },
			saveData,
		});
		expect(beat.nextBeats()).toEqual(['3', '1', '2']);
	});
});
