export class Chapter {
	start;
	isLocked;

	constructor (params: any = {}) {
		Object.assign(this, params);

		this.start = jest.fn();
		this.isLocked = jest.fn().mockReturnValue(params.isLocked);
	}
}