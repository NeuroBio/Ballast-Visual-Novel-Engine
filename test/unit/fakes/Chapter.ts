export class Chapter {
	params;

	constructor (params: any = {}) {
		Object.assign(this, params);
		this.params = params;
	}

	start = jest.fn();
	reload = jest.fn();
	isLocked = jest.fn().mockImplementation(() => this.params.isLocked);
}