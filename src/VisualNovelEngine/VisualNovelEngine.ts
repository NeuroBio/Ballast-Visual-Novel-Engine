export class VisualNovelEngine {
	#player;
	#currentChapter;

	getChapters () {
		// requires player

		// returns array of relevant chapters based on unknown criteria
	}

	loadChapter () {
		// required Chapter Key
		// optional Scene Key, default to first Scene
		// optional Beat Key, default to first Beat

		// ChapterFinder gets Chapter by key
		// Chapter loads Scene by optional key
		// Scene plays first beat

		// updates character states as needed
		// returns UI display data
		// MVP: text + key to display
	}

	advanceScene () {
		// required beat key

		// Scene.play(beatKey)

		// If the next beat is not present
		// unlock next scene (is any)
		// if final scene, unlock next chapter (if any)

		// returns UI display data
		// MVP: text + key to display

		// let the UI deal with the rest
	}

	advanceChapter () {
		// required scene key
		// Chapter.next(sceneKey)
		// Scene plays first beat
	}

	saveGame () {
		// save allowed/completed chapters
		// save completed scenes
		// save character states
	}
}