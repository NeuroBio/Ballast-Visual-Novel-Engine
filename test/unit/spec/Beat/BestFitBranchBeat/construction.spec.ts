import { BestFitBranchBeat } from '../../../../../src/Beat/BestFitBranchBeat';

describe(`BestFitBranchBeat.construction`, () => {
	const Error = Object.freeze({
		DEFAULT_REQUIRED: 'When all branches are conditional, a Default Behavior is required.',
		USE_SIMPLE_BEAT: 'Best Fit Branch beats require at least 2 branches.',
		USE_FIRST_FIT_BEAT: 'Only one unique character found on branches.  Use a First Fit Branch Beat instead.',
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

	describe(`constructing without branches`, () => {
		it(`throws an error`, () => {
			expect(() => {
				new BestFitBranchBeat({ key: 'key', branches: [], crossBranchCondition: () => '', saveData });
			}).toThrow(Error.USE_SIMPLE_BEAT);
		});
	});
	describe(`constructing with only 1 branch`, () => {
		it(`throws an error`, () => {
			expect(() => {
				new BestFitBranchBeat({
					key: 'key',
					crossBranchCondition: () => '',
					branches: [{ beat: { text: '', character: '', nextBeat: '', sceneData }, conditions:[] }],
					saveData,
				});
			}).toThrow(Error.USE_SIMPLE_BEAT);
		});
	});
	describe(`constructing with 2 unconditional branches`, () => {
		it(`creates a Best Fit Branch Beat`, () => {
			const beat = new BestFitBranchBeat({
				key: 'key',
				crossBranchCondition: () => '',
				branches: [
					{ beat: { text: '', character: '1', nextBeat: '', sceneData }, conditions:[] },
					{ beat: { text: '', character: '2', nextBeat: '', sceneData }, conditions:[] },
				],
				saveData,
			});

			expect(beat instanceof BestFitBranchBeat).toBe(true);
		});
	});
	describe(`constructing when branches only have 1 unique character`, () => {
		it(`throws an error`, () => {
			expect(() => {
				new BestFitBranchBeat({
					key: 'key',
					crossBranchCondition: () => '',
					branches: [
						{ beat: { text: '', character: '', nextBeat: '', sceneData }, conditions:[] },
						{ beat: { text: '', character: '1', nextBeat: '', sceneData }, conditions:[] },
						{ beat: { text: '', character: '1', nextBeat: '', sceneData }, conditions:[] },
					],
					saveData,
				});
			}).toThrow(Error.USE_FIRST_FIT_BEAT);
		});
	});
	describe(`constructing with 2 conditional branches and no default behavior`, () => {
		it(`throws an error`, () => {
			expect(() => {
				new BestFitBranchBeat({
					key: 'key',
					crossBranchCondition: () => '',
					branches: [
						{ beat: { text: '', character: '1', nextBeat: '', sceneData }, conditions:[() => true] },
						{ beat: { text: '', character: '2', nextBeat: '', sceneData }, conditions:[() => true] },
					],
					saveData,
				});
			}).toThrow(Error.DEFAULT_REQUIRED);
		});
	});
	describe(`constructing with 2 conditional branches and default behavior`, () => {
		it(`creates a Best Fit Branch Beat`, () => {
			const beat = new BestFitBranchBeat({
				key: 'key',
				crossBranchCondition: () => '',
				branches: [
					{ beat: { text: '', character: '1', nextBeat: '', sceneData }, conditions:[() => true] },
					{ beat: { text: '', character: '2', nextBeat: '', sceneData }, conditions:[() => true] },
				],
				defaultBehavior: { text: '', nextBeat: '', sceneData },
				saveData,
			});

			expect(beat instanceof BestFitBranchBeat).toBe(true);
		});
	});
});
