export class Character {
	params: any;
	name: string;
	key: string;
	traits: { [key:string]: number };
	memories: { [key:string]: string };

	constructor (params: any) {
		Object.assign(this, params);
		this.params = params;
	}

	clone = jest.fn();
	toDto = jest.fn();
	hasMemory = jest.fn();
	addMemory = jest.fn();
	removeMemory = jest.fn();
	updateTrait = jest.fn();
}