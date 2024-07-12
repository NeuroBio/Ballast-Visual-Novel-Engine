export class SavedData {
	toDto;

	constructor (params: any = {}) {
		Object.assign(this, params);
		this.toDto = jest.fn().mockReturnValue(params);
	}

	startNewChapter = jest.fn();
	completeChapter = jest.fn();
	startNewScene = jest.fn();
	getChapterData = jest.fn().mockResolvedValue({});
}
