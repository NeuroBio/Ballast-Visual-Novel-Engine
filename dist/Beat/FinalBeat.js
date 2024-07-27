import { Beat } from './Beat';
export class FinalBeat extends Beat {
    #defaultBehavior;
    constructor(params) {
        const { defaultBehavior } = params;
        super(params);
        this.#defaultBehavior = defaultBehavior;
    }
    play(params) {
        const { characters } = params;
        const character = this.getCharacter({
            character: this.#defaultBehavior.character,
            characters,
        });
        return {
            text: this.#defaultBehavior.text,
            speaker: character,
            saveData: this.createSaveDataSideEffects(),
            sceneData: this.#defaultBehavior.sceneData,
        };
    }
    nextBeats() {
        return [];
    }
}
