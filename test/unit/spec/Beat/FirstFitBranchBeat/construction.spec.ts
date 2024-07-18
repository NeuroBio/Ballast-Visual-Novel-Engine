import { FirstFitBranchBeat } from '../../../../../src/Beat/FirstFitBranchBeat';

describe(`FirstFitBranchBeat.construction`, () => {
	const Error = Object.freeze({
		NO_BRANCHING: 'Branch Beats require at least 1 branch.',
		CANNOT_BRANCH: 'When no branches are conditional, data should be formatted as a Simple Beat, not a Branch Beat.',
		REQUIRE_CONDITIONS: 'All branches in a First Fit Branch Beat should be conditional.',
	});

	describe(`constructed with no branches`, () => {
		it(`throws an error`, () => {
			expect(() => new FirstFitBranchBeat({
				key: 'key',
				branches: [],
				defaultBehavior: { text: '', nextBeat: '' },
			})).toThrow(Error.NO_BRANCHING);
		});
	});
	describe(`constructed with multiple branches none of which are conditional`, () => {
		it(`throws an error`, () => {
			expect(() => new FirstFitBranchBeat({
				key: 'key',
				branches: [
					{
						beat: { text: '', nextBeat: '' },
						conditions: [],
					},
					{
						beat: { text: '', nextBeat: '' },
						conditions: [],
					},
				],
				defaultBehavior: { text: '', nextBeat: '' },
			})).toThrow(Error.CANNOT_BRANCH);
		});
	});
	describe(`constructed with multiple branches some of which are conditional`, () => {
		it(`throws an error`, () => {
			expect(() => new FirstFitBranchBeat({
				key: 'key',
				branches: [
					{
						beat: { text: '', nextBeat: '' },
						conditions: [],
					},
					{
						beat: { text: '', nextBeat: '' },
						conditions: [() => true],
					},
				],
				defaultBehavior: { text: '', nextBeat: '' },
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
						beat: { text: '', nextBeat: '' },
						conditions: [() => true],
					},
					{
						beat: { text: '', nextBeat: '' },
						conditions: [() => true],
					},
				],
				defaultBehavior: { text: '', nextBeat: '' },
			});

			expect(beat instanceof FirstFitBranchBeat).toBe(true);
		});
	});
});