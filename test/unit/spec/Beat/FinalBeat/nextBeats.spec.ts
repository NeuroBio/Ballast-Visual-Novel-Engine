import { FinalBeat } from '../../../../../src/Beat/FinalBeat';

describe(`FinalBeat.nextBeats`, () => {
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
	it(`returns nothing quietly`, () => {
		const beat = new FinalBeat({ key: '', defaultBehavior: { text: '', sceneData }, saveData });
		expect(beat.nextBeats()).toEqual([]);
	});
});
