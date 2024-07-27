import { BestFitBranchBeat } from '../../../../../src/Beat/BestFitBranchBeat';

describe(`BestFitBranchBeat.nextBeats`, () => {
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
		const beat = new BestFitBranchBeat({
			key: 'key',
			crossBranchCondition: () => '',
			branches: [
				{ beat: { text: '', character: '1', nextBeat: '1', sceneData }, conditions:[() => true] },
				{ beat: { text: '', character: '2', nextBeat: '2', sceneData }, conditions:[() => true] },
			],
			defaultBehavior: { text: '', nextBeat: '3', sceneData },
			saveData,
		});
		expect(beat.nextBeats()).toEqual(['3', '1', '2']);
	});
});
