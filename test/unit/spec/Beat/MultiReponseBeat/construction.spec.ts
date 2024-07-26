import { MultiResponseBeat } from '../../../../../src/Beat/MultiResponseBeat';

describe(`MultiResponseBeat.construction`, () => {
	const Error = Object.freeze({
		USE_SIMPLE_BEAT: 'Multi Response Beats require at least 2 responses.  Use a Simple Beat or First Fit Branch Beat Instead.',
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

	describe(`beat has no responses`, () => {
		it(`throws invalid error`, () => {
			expect(() => {
				new MultiResponseBeat({
					key: 'key',
					responses: [],
					defaultBehavior: { nextBeat: 'beat', text: 'default', sceneData },
					saveData,
				});
			}).toThrow(Error.USE_SIMPLE_BEAT);
		});
	});
	describe(`beat has only one response`, () => {
		it(`throws invalid error`, () => {
			expect(() => {
				new MultiResponseBeat({
					key: 'key',
					responses: [{ beat: { text: 'res', sceneData }, conditions: [] }],
					defaultBehavior: { nextBeat: 'beat', text: 'default', sceneData },
					saveData,
				});
			}).toThrow(Error.USE_SIMPLE_BEAT);
		});
	});
	describe(`beat has responses without conditions and no character is set`, () => {
		it(`constructs without error`, () => {
			const beat = new MultiResponseBeat({
				key: 'key',
				responses: [
					{ beat: { text: 'res', sceneData }, conditions: [] },
					{ beat: { text: 'res', sceneData }, conditions: [] },
				],
				defaultBehavior: { nextBeat: 'beat', text: 'default', sceneData },
				saveData,
			});
			expect(beat instanceof MultiResponseBeat).toBe(true);
		});
	});
	describe(`beat has a response with a condition and character is set`, () => {
		it(`constructs without error`, () => {
			const beat = new MultiResponseBeat({
				key: 'key',
				responses: [
					{ beat: { text: 'res', sceneData }, conditions: [() => true] },
					{ beat: { text: 'res', sceneData }, conditions: [] },
				],
				defaultBehavior: { nextBeat: 'beat', text: 'default', character: 'char', sceneData },
				saveData,
			});
			expect(beat instanceof MultiResponseBeat).toBe(true);
		});
	});
	describe(`beat has all choices with conditions`, () => {
		it(`constructs without error`, () => {
			const beat = new MultiResponseBeat({
				key: 'key',
				responses: [
					{ beat: { text: 'res', sceneData }, conditions: [() => true] },
					{ beat: { text: 'res', sceneData }, conditions: [() => true] },
				],
				defaultBehavior: { nextBeat: 'beat', text: 'default', character: 'char', sceneData },
				saveData,
			});
			expect(beat instanceof MultiResponseBeat).toBe(true);
		});
	});
});
