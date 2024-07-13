export class Character {
	params: any;
	name: string;
	key: string;

	constructor (params: any) {
		Object.assign(this, params);
		this.params = params;
	}

	clone = jest.fn();
	toDto = jest.fn();
}