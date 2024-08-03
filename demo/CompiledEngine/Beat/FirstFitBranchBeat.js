import { Beat } from './Beat.js';
export class FirstFitBranchBeat extends Beat {
    #branches;
    #defaultBehavior;
    constructor(params) {
        const { defaultBehavior, branches } = params;
        super(params);
        this.#defaultBehavior = defaultBehavior;
        this.#branches = branches;
        if (branches.length < 1) {
            throw new Error('Branch Beats require at least 1 branch.');
        }
        const branchesWithRequirements = branches.filter(x => x.conditions.length > 0);
        if (branchesWithRequirements.length !== branches.length) {
            throw new Error('All branches in a First Fit Branch Beat should be conditional.');
        }
    }
    play(params) {
        const { characters } = params;
        let beat;
        for (const branch of this.#branches) {
            if (branch.conditions.every((condition) => condition(params))) {
                beat = branch.beat;
                break;
            }
        }
        beat ??= this.#defaultBehavior;
        return this.assembleStandardBeatDisplay({ beat, characters });
    }
    nextBeats() {
        const nextBeat = [];
        if (this.#defaultBehavior) {
            nextBeat.push(this.#defaultBehavior.nextBeat);
        }
        nextBeat.push(...this.#branches.map((b) => b.beat.nextBeat));
        return nextBeat;
    }
}
