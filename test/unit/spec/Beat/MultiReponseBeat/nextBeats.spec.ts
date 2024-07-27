import { MultiResponseBeat } from '../../../../../src/Beat/MultiResponseBeat';

describe(`MultiResponseBeat.nextBeats`, () => {
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
		const beat = new MultiResponseBeat({
			key: 'key',
			responses: [
				{ beat: { text: '', nextBeat: '1', sceneData }, conditions: [() => true] },
				{ beat: { text: '', nextBeat: '2', sceneData }, conditions: [() => true] },
			],
			defaultBehavior: { nextBeat: '3', text: 'default', character: 'char', sceneData },
			saveData,
		});
		expect(beat.nextBeats()).toEqual(['3', '1', '2']);
	});
});
