import { SimpleBeat } from '../../../../../src/Beat/SimpleBeat';

describe(`SimpleBeat.nextBeats`, () => {
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
		const beat = new SimpleBeat({ key: '', defaultBehavior: { text: '', nextBeat: '1', sceneData }, saveData });
		expect(beat.nextBeats()).toEqual(['1']);
	});
});
