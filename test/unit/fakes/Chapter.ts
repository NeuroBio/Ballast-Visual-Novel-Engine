export class Chapter {
	isLocked;

	constructor (params: any = {}) {
		Object.assign(this, params);

		this.isLocked = jest.fn().mockReturnValue(params.isLocked);
	}

	start = jest.fn();
	reload = jest.fn();
}