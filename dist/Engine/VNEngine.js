import { Engine } from './Engine';
export class VNEngine {
    static #activeEngine;
    static create(params) {
        this.#activeEngine = new Engine(params);
        return this.#activeEngine;
    }
    static getLastEngine() {
        return this.#activeEngine;
    }
}
