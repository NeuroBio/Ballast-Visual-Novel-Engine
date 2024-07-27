import { FinalBeat } from './FinalBeat';
import { ChoiceBeat } from './ChoiceBeat';
import { SimpleBeat } from './SimpleBeat';
import { FirstFitBranchBeat } from './FirstFitBranchBeat';
import { MultiResponseBeat } from './MultiResponseBeat';
import { BestFitBranchBeat } from './BestFitBranchBeat';
// Conditionals
export var SingleConditionType;
(function (SingleConditionType) {
    SingleConditionType["AT_LEAST_ITEM"] = "itemEqual+";
    SingleConditionType["AT_MOST_ITEM"] = "itemEqual-";
    SingleConditionType["CHARACTER_AWARE"] = "hasMemory";
    SingleConditionType["CHARACTER_UNAWARE"] = "lacksMemory";
    SingleConditionType["AT_LEAST_CHAR_TRAIT"] = "charTraitEqual+";
    SingleConditionType["AT_MOST_CHAR_TRAIT"] = "charTraitEqual-";
    SingleConditionType["CHARACTER_PRESENT"] = "charPresent";
    SingleConditionType["CHARACTER_ABSENT"] = "charAbsent";
})(SingleConditionType || (SingleConditionType = {}));
export var CrossConditionType;
(function (CrossConditionType) {
    CrossConditionType["GREATEST_SENTIMENT"] = "charMost";
    CrossConditionType["LEAST_SENTIMENT"] = "charLeast";
})(CrossConditionType || (CrossConditionType = {}));
export class BeatFactory {
    fromDto(dto) {
        if (this.#isSimpleBeat(dto)) {
            return this.#createSimpleBeat(dto);
        }
        if (this.#isChoiceBeat(dto)) {
            return this.#createChoiceBeat(dto);
        }
        if (this.#isFirstFitBranchBeat(dto)) {
            return this.#createFirstFitBranchBeat(dto);
        }
        if (this.#isBestFitBranchBeat(dto)) {
            return this.#createBestFitBranchBeat(dto);
        }
        if (this.#isMultiResponseBeat(dto)) {
            return this.#createMultiResponseBeat(dto);
        }
        if (this.#isFinalBeat(dto)) {
            return this.#createFinalBeat(dto);
        }
        throw new Error(`Received malformed beat data for beat ${dto.key}.  See the documentation for expected shapes for different beat types.`);
    }
    #createSimpleBeat(dto) {
        const params = {
            defaultBehavior: {
                character: dto.defaultBehavior.character,
                text: dto.defaultBehavior.text,
                nextBeat: dto.defaultBehavior.nextBeat,
                sceneData: this.#setSceneData(dto.defaultBehavior),
            },
            ...this.#setSharedParams(dto),
        };
        return new SimpleBeat(params);
    }
    #createChoiceBeat(dto) {
        const defaultBehavior = dto.defaultBehavior
            ? {
                character: dto.defaultBehavior.character,
                text: dto.defaultBehavior.text,
                nextBeat: dto.defaultBehavior.nextBeat,
                sceneData: this.#setSceneData(dto.defaultBehavior),
            }
            : undefined;
        const params = {
            choices: dto.choices.map((choice) => ({
                beat: { text: choice.text, nextBeat: choice.nextBeat, mayPlay: false },
                conditions: this.#createSingleCondition(choice.conditions || [], dto.key) || [],
            })),
            defaultBehavior,
            ...this.#setSharedParams(dto),
        };
        return new ChoiceBeat(params);
    }
    #createFirstFitBranchBeat(dto) {
        const params = {
            branches: dto.branches.map((branch) => ({
                beat: {
                    text: branch.text,
                    nextBeat: branch.nextBeat,
                    character: branch.character,
                    sceneData: this.#setSceneData(branch),
                },
                conditions: this.#createSingleCondition(branch.conditions || [], dto.key) || [],
            })),
            defaultBehavior: {
                character: dto.defaultBehavior.character,
                text: dto.defaultBehavior.text,
                nextBeat: dto.defaultBehavior.nextBeat,
                sceneData: this.#setSceneData(dto.defaultBehavior),
            },
            ...this.#setSharedParams(dto),
        };
        return new FirstFitBranchBeat(params);
    }
    #createBestFitBranchBeat(dto) {
        const defaultBehavior = dto.defaultBehavior
            ? {
                character: dto.defaultBehavior.character,
                text: dto.defaultBehavior.text,
                nextBeat: dto.defaultBehavior.nextBeat,
                sceneData: this.#setSceneData(dto.defaultBehavior),
            }
            : undefined;
        const params = {
            branches: dto.branches.map((branch) => ({
                beat: {
                    text: branch.text,
                    nextBeat: branch.nextBeat,
                    character: branch.character,
                    sceneData: this.#setSceneData(branch),
                },
                conditions: this.#createSingleCondition(branch.conditions || [], dto.key) || [],
            })),
            crossBranchCondition: this.#createCrossCondition(dto.crossBranchCondition, dto.key),
            defaultBehavior,
            ...this.#setSharedParams(dto),
        };
        return new BestFitBranchBeat(params);
    }
    #createMultiResponseBeat(dto) {
        const params = {
            responses: dto.responses.map((response) => ({
                beat: {
                    text: response.text,
                    nextBeat: response.nextBeat,
                    character: response.character,
                    sceneData: this.#setSceneData(dto.defaultBehavior),
                },
                conditions: this.#createSingleCondition(response.conditions || [], dto.key) || [],
            })),
            defaultBehavior: {
                character: dto.defaultBehavior.character,
                text: dto.defaultBehavior.text,
                nextBeat: dto.defaultBehavior.nextBeat,
                sceneData: this.#setSceneData(dto.defaultBehavior),
            },
            ...this.#setSharedParams(dto),
        };
        return new MultiResponseBeat(params);
    }
    #createFinalBeat(dto) {
        const params = {
            defaultBehavior: {
                character: dto.defaultBehavior.character,
                text: dto.defaultBehavior.text,
                sceneData: this.#setSceneData(dto.defaultBehavior),
            },
            ...this.#setSharedParams(dto),
        };
        return new FinalBeat(params);
    }
    // Type Checkers
    #isSimpleBeat(dto) {
        if (dto.choices || dto.responses || dto.branches || dto.crossBranchCondition) {
            return false;
        }
        if (!dto.defaultBehavior) {
            return false;
        }
        this.#validateDisplaySideEffects(dto.key, dto.defaultBehavior);
        return !!(dto.defaultBehavior.text && dto.defaultBehavior.nextBeat);
    }
    #isChoiceBeat(dto) {
        if (dto.responses || dto.branches || !dto.choices || dto.crossBranchCondition) {
            return false;
        }
        for (const choice of dto.choices) {
            if (!choice.text || !choice.nextBeat) {
                return false;
            }
        }
        if (dto.defaultBehavior) {
            return !!(dto.defaultBehavior.text && dto.defaultBehavior.nextBeat);
        }
        return true;
    }
    #isFirstFitBranchBeat(dto) {
        if (dto.responses || !dto.branches || dto.choices || !dto.defaultBehavior || dto.crossBranchCondition) {
            return false;
        }
        for (const branch of dto.branches) {
            if (!branch.text || !branch.nextBeat || !branch.conditions || branch.conditions.length < 1) {
                return false;
            }
            this.#validateDisplaySideEffects(dto.key, dto.defaultBehavior);
        }
        this.#validateDisplaySideEffects(dto.key, dto.defaultBehavior);
        return !!(dto.defaultBehavior.text && dto.defaultBehavior.nextBeat);
    }
    #isBestFitBranchBeat(dto) {
        if (dto.responses || !dto.branches || dto.choices || !dto.crossBranchCondition) {
            return false;
        }
        for (const branch of dto.branches) {
            if (!branch.text || !branch.nextBeat || !branch.character) {
                return false;
            }
        }
        if (dto.defaultBehavior) {
            return !!(dto.defaultBehavior.text && dto.defaultBehavior.nextBeat);
        }
        return true;
    }
    #isMultiResponseBeat(dto) {
        if (!dto.responses || dto.branches || dto.choices || !dto.defaultBehavior || dto.crossBranchCondition) {
            return false;
        }
        for (const response of dto.responses) {
            if (!response.text) {
                return false;
            }
            this.#validateDisplaySideEffects(dto.key, dto.defaultBehavior);
        }
        this.#validateDisplaySideEffects(dto.key, dto.defaultBehavior);
        return !!(dto.defaultBehavior.text && dto.defaultBehavior.nextBeat);
    }
    #isFinalBeat(dto) {
        if (dto.choices || dto.responses || dto.branches || dto.crossBranchCondition) {
            return false;
        }
        if (!dto.defaultBehavior) {
            return false;
        }
        this.#validateDisplaySideEffects(dto.key, dto.defaultBehavior);
        return !!(dto.defaultBehavior.text && !dto.defaultBehavior.nextBeat);
    }
    #validateDisplaySideEffects(key, data) {
        const check = data.sceneData;
        if (!check) {
            return true;
        }
        const errorMessage = `Received malformed display side effect data for beat ${key}.  See the documentation for expected shapes for side effects.`;
        if (Object.hasOwn(check, 'setBackground')) {
            if (!check.setBackground) {
                throw new Error(errorMessage);
            }
        }
        if (Object.hasOwn(check, 'updateCharacterSprites')) {
            check.updateCharacterSprites.forEach((x) => {
                if (!x.character || !x.sprite) {
                    throw new Error(errorMessage);
                }
            });
        }
        if (Object.hasOwn(check, 'moveCharacters')) {
            check.moveCharacters.forEach((x) => {
                if (!x.character || !_isInt(x.newPosition)) {
                    throw new Error(errorMessage);
                }
            });
        }
        if (Object.hasOwn(check, 'removeCharacters')) {
            check.removeCharacters.forEach((x) => {
                if (!x.character) {
                    throw new Error(errorMessage);
                }
            });
        }
        if (Object.hasOwn(check, 'addCharacters')) {
            check.addCharacters.forEach((x) => {
                if (!x.character || !x.sprite || !_isInt(x.position)) {
                    throw new Error(errorMessage);
                }
            });
        }
        return true;
        function _isInt(data) {
            if (!data && data !== 0) {
                return false;
            }
            return data % 1 === 0;
        }
    }
    // Create Shared Data
    #createSingleCondition(conditions, key) {
        return conditions.map((condition) => {
            switch (condition.type) {
                case SingleConditionType.AT_LEAST_ITEM: {
                    const { item, quantity } = condition;
                    return (params) => (params.inventory[item] || 0) >= quantity;
                }
                case SingleConditionType.AT_MOST_ITEM: {
                    const { item, quantity } = condition;
                    return (params) => (params.inventory[item] || 0) <= quantity;
                }
                case SingleConditionType.CHARACTER_AWARE: {
                    const { character, memory } = condition;
                    return (params) => params.characters[character]?.hasMemory(memory) || false;
                }
                case SingleConditionType.CHARACTER_UNAWARE: {
                    const { character, memory } = condition;
                    return (params) => !params.characters[character]?.hasMemory(memory) || false;
                }
                case SingleConditionType.AT_LEAST_CHAR_TRAIT: {
                    const { character, trait, value } = condition;
                    return (params) => params.characters[character]?.traits[trait] >= value || false;
                }
                case SingleConditionType.AT_MOST_CHAR_TRAIT: {
                    const { character, trait, value } = condition;
                    return (params) => params.characters[character]?.traits[trait] <= value || false;
                }
                case SingleConditionType.CHARACTER_PRESENT: {
                    const { character } = condition;
                    return (params) => params.scene.characters.has(character);
                }
                case SingleConditionType.CHARACTER_ABSENT: {
                    const { character } = condition;
                    return (params) => !params.scene.characters.has(character);
                }
                default: throw new Error(`Received an unexpected type for single condition on beat ${key}`);
            }
        });
    }
    #createCrossCondition(condition, key) {
        switch (condition.type) {
            case CrossConditionType.GREATEST_SENTIMENT: {
                const { trait } = condition;
                return (params) => {
                    const { characters } = params;
                    let maxChar = characters[0];
                    characters.forEach((char) => {
                        const current = char.traits[trait] || 0;
                        const prior = maxChar.traits[trait] || 0;
                        if (current > prior) {
                            maxChar = char;
                        }
                    });
                    return maxChar.key;
                };
            }
            case CrossConditionType.LEAST_SENTIMENT: {
                const { trait } = condition;
                return (params) => {
                    const { characters } = params;
                    let minChar = characters[0];
                    characters.forEach((char) => {
                        const current = char.traits[trait] || 0;
                        const prior = minChar.traits[trait] || 0;
                        if (current < prior) {
                            minChar = char;
                        }
                    });
                    return minChar.key;
                };
            }
            default: throw new Error(`Received an unexpected type for cross condition on beat ${key}`);
        }
    }
    #setSharedParams(dto) {
        return {
            key: dto.key,
            saveData: {
                queuedScenes: dto.saveData?.queuedScenes || [],
                unlockedChapters: dto.saveData?.unlockedChapters || [],
                unlockedAchievements: dto.saveData?.unlockedAchievements || [],
                addedItems: dto.saveData?.addedItems || [],
                removedItems: dto.saveData?.removedItems || [],
                addedMemories: dto.saveData?.addedMemories || [],
                removedMemories: dto.saveData?.removedMemories || [],
                updatedCharacterTraits: dto.saveData?.updatedCharacterTraits || [],
            },
        };
    }
    #setSceneData(data) {
        return {
            setBackground: data?.sceneData?.setBackground || '',
            updateCharacterSprites: data?.sceneData?.updateCharacterSprites || [],
            moveCharacters: data?.sceneData?.moveCharacters || [],
            removeCharacters: data?.sceneData?.removeCharacters || [],
            addCharacters: data?.sceneData?.addCharacters || [],
        };
    }
}
