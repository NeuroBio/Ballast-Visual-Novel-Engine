# Visual-Novel-Engine
What it says on the tin.  I'm building out my own engine so I can add more complex mechanics to it while still keeping the codebase light and fast.
This part of the project is JUST the story engine.  Eventually, there will be a separate repo for UI logic in javascript and maybe one more for a fully implemented UI.  That last bit may only exist in my own fully fleshed out story project.  Not sure yet.

# Design Decisions
## Engine

### Main Responsibilities
i.e. the things the engine does by default; the implementation is not customizable
- Beginning specified Chapter
- Beginning next Scene (as dictated by Chapter OR save data)
- Playing specified Beat and applying its affects on save data
	- Updating Active Chapter(s) + its queued scene
	- Updating character sentiments + memories
	- Updating inventory items + their quantity
	- Adding Achievements

### Delegated Responsibilities
i.e. things the engine provides an interface for, but requires an implementation to achieve; is customizable
- Loading Chapter data
- Loading Scene data
- Loading Save data
- Saving Save data

### Not Responsible For
- deciding what chapter to play
   - It has to be told; it will not make assumptions based on the save data
   - It will know what scene to play though; See queued scene in Save data
- deciding WHEN to...
	- save data
		- it is always updating save data in memory
		- it must be told when/where to write it
	- play Beats, Scenes, Chapters
		- When told to start a chapter, it will automatically play the first beat from the first scene
		- after that, it will not play another beat until told to
			- most likely, it's a UI trigger that does this

## Save Data
- Active Chapters:
	- a keyed dictionary of chapter key: queued chapter
	- the queued chapter will be equivalent to the engine's current chapter most of the time
		- the two disconnect when a final beat dictates what the next scene should be
	- Once a chapter is complete, it is removed from Active Chapters and moves to Completed Chapters