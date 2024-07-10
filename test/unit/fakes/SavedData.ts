export class SavedData {
	startNewChapter;
	completeChapter;
	startNewScene;
	toDto;

	constructor (params: any = {}) {
		Object.assign(this, params);

		this.startNewChapter = jest.fn();
		this.completeChapter = jest.fn();
		this.startNewScene = jest.fn();
		this.toDto = jest.fn().mockReturnValue(params);
	}
}
