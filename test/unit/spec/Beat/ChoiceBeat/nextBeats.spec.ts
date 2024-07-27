import { ChoiceBeat } from '../../../../../src/Beat/ChoiceBeat';

describe(`ChoiceBeat.nextBeats`, () => {
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
		const choice1 = { beat: { text:'', nextBeat: '1', mayPlay: false }, conditions: [() => false] };
		const choice2 = { beat: { text:'', nextBeat: '2', mayPlay: false }, conditions: [() => false] };
		const choice3 = { beat: { text:'', nextBeat: '3', mayPlay: false }, conditions: [() => false] };
		const defaultBehavior = { text:'', nextBeat: '4', sceneData };
		const choices = [ choice1, choice2, choice3];

		const beat = new ChoiceBeat({ key: 'key', choices, defaultBehavior, saveData });
		expect(beat.nextBeats()).toEqual(['4', '1', '2', '3']);
	});
});
