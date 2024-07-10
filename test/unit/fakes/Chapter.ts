export class Chapter {
	constructor (params: any = {}) {
		Object.assign(this, params);
	}
	start = jest.fn();
	isLocked = jest.fn();
}