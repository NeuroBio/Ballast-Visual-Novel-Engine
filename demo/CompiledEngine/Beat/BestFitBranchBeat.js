import { Beat } from './Beat.js';
export class BestFitBranchBeat extends Beat {
	#branches;
	#crossBranchCondition;
	#defaultBehavior;
	constructor (params) {
		const { branches, crossBranchCondition, defaultBehavior } = params;
		super(params);
		this.#branches = branches;
		this.#crossBranchCondition = crossBranchCondition;
		this.#defaultBehavior = defaultBehavior;
		if (branches.length < 2) {
			throw new Error('Best Fit Branch beats require at least 2 branches.');
		}
		const branchesWithRequirements = branches.filter(x => x.conditions.length > 0);
		if (branchesWithRequirements.length === branches.length && !defaultBehavior) {
			throw new Error('When all branches are conditional, a Default Behavior is required.');
		}
		const uniqueCharacters = new Set();
		branches.forEach(branch => {
			const char = branch.beat.character;
			if (char) {
				uniqueCharacters.add(char);
			}
		});
		if (uniqueCharacters.size < 2) {
			throw new Error('Only one unique character found on branches.  Use a First Fit Branch Beat instead.');
		}
	}
	play (params) {
		const { characters } = params;
		const validBranches = [];
		this.#branches.forEach((branch) => {
			const includeBranch = this.#mayPlay(branch, params);
			if (includeBranch) {
				validBranches.push(branch);
			}
		});
		const keys = Array.from(new Set(validBranches.map(x => x.beat.character)));
		let beat;
		if (keys.length > 1) {
			const relevantCharacters = keys.map((key) => characters[key]);
			const key = this.#crossBranchCondition({ characters: relevantCharacters });
			beat = validBranches.find(x => x.beat.character === key).beat;
		}
		if (keys.length === 1) {
			beat = validBranches[0].beat;
		}
		beat ??= this.#defaultBehavior;
		return this.assembleStandardBeatDisplay({ beat, characters });
	}
	nextBeats () {
		const nextBeat = [];
		if (this.#defaultBehavior) {
			nextBeat.push(this.#defaultBehavior.nextBeat);
		}
		nextBeat.push(...this.#branches.map((b) => b.beat.nextBeat));
		return nextBeat;
	}
	#mayPlay (branch, params) {
		if (branch.conditions.length === 0) {
			return true;
		}
		return branch.conditions.every((condition) => condition(params));
	}
}
