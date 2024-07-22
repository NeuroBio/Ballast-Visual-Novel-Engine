import { BestFitBranchBeat } from '../../../../../src/Beat/BestFitBranchBeat';

describe(`BestFitBranchBeat.construction`, () => {
	const Error = Object.freeze({
		DEFAULT_REQUIRED: 'When all branches are conditional, a Default Behavior is required.',
		USE_SIMPLE_BEAT: 'Best Fit Branch beats require at least 2 branches.',
		USE_FIRST_FIT_BEAT: 'Only one unique character found on branches.  Use a First Fit Branch Beat instead.',
	});
	describe(`constructing without branches`, () => {
		it(`throws an error`, () => {
			expect(() => {
				new BestFitBranchBeat({ key: 'key', branches: [], crossBranchCondition: () => '' });
			}).toThrow(Error.USE_SIMPLE_BEAT);
		});
	});
	describe(`constructing with only 1 branch`, () => {
		it(`throws an error`, () => {
			expect(() => {
				new BestFitBranchBeat({
					key: 'key',
					crossBranchCondition: () => '',
					branches: [{ beat: { text: '', character: '', nextBeat: '' }, conditions:[] }],
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
					{ beat: { text: '', character: '1', nextBeat: '' }, conditions:[] },
					{ beat: { text: '', character: '2', nextBeat: '' }, conditions:[] },
				],
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
						{ beat: { text: '', character: '', nextBeat: '' }, conditions:[] },
						{ beat: { text: '', character: '1', nextBeat: '' }, conditions:[] },
						{ beat: { text: '', character: '1', nextBeat: '' }, conditions:[] },
					],
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
						{ beat: { text: '', character: '1', nextBeat: '' }, conditions:[() => true] },
						{ beat: { text: '', character: '2', nextBeat: '' }, conditions:[() => true] },
					],
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
					{ beat: { text: '', character: '1', nextBeat: '' }, conditions:[() => true] },
					{ beat: { text: '', character: '2', nextBeat: '' }, conditions:[() => true] },
				],
				defaultBehavior: { text: '', nextBeat: '' },
			});

			expect(beat instanceof BestFitBranchBeat).toBe(true);
		});
	});
});
