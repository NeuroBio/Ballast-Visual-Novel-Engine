export class Chapter {
	params;

	constructor (params: any = {}) {
		Object.assign(this, params);
		this.params = params;
	}

	get isLocked () {
		return this.params.isLocked;
	}

	start = jest.fn();
	reload = jest.fn();
}