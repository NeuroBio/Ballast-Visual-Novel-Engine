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
	- Updating Active Chapter(s) queued scenes
	- Updating character sentiments + memories
	- Updating inventory items + their quantity
	- unlocking Achievements
	- unlocking chapters
	- returns data for UI to display (UI concerns NOT covered in this repo)
- completing a scene
	- blocks completion if current beat is not of type final beat
	- completes a chapter if there is no queued scene OR queued scene or current chapter
		- i.e. removes it from active chapters and adds it to completed chapters
	- autosaves

### Delegated Responsibilities
i.e. things the engine provides an interface for, but requires an implementation to achieve; is customizable
- Loading Chapter data
- Loading Scene data
- Loading Character Template data (default state for characters)
- Loading Save data
- Saving Save data
- Autosaving save data

### Not Responsible For
- deciding what chapter to play
   - It has to be told; it will not make assumptions based on the save data
   - It will know what scene to play though; See queued scene in Save data
- deciding WHEN to...
	- manually save data
		- it is always updating save data in memory
		- it must be told when/where to write it
	- play Beats, Scenes, Chapters
		- When told to start a chapter, it will automatically play the first beat from the first scene
		- after that, it will not play another beat until told to
			- most likely, it's a UI trigger that does this

## Save Data
- Active Chapters
	- a keyed dictionary of chapter key: queued chapter
	- the queued chapter will be equivalent to the engine's current chapter most of the time
		- the two disconnect when a final beat dictates what the next scene should be
	- Once a chapter is complete, it is removed from Active Chapters and moves to Completed Chapters
- Completed Chapters
	- array of chapter keys
- Unlocked Chapters
	- array of chapter keys
- Characters
	- array of character data
		- memories: key for a specific beat; allows referencing events across chapters
			- e.g: you helped a character, so they can bring that up later (or act differently if you if not help)
		- sentiments: dict of a "sentiment" and it's numeric value (e.g. like: .324)
			- references across chapters to affect general responses, display sprite sets, or relationship-driven branches
- Inventory
	- dict of item keys + qty
	- Items are mostly for use in PnC parts of a game, but this allows items to be gained/lost in conversation
- Achievements
	- array of achievement keys

## Intended Use-Cases that are not Typical of VNs
- Allow non-linear, randomized story structure
- building relationships with characters is NOT based on choosing the right branch from a small number of choice branches (doing so would interfere with the non-linear storyline needs).  "Sentiments" are build incrementally on almost every choice made (expected change range 0.001-0.005).  There are very few make-or-break decisions, and they are very obvious (e.g. killing a character).
-  sprite sets shift depending on sentiments.  The UI will have to be built to support this, but the sentiment structure is built to support this concept:
	- the base sprite set is "neutral"
	- one off sprites for special scenes are "special"
	- additional sets could be "friend," "partner," "enemy," ect
		- additional sets have matching keys to the neutral set
		- e.g. if neutral has an "angry" sprite, then the "angry" sprite in the enemy set would look more angry because the characters have a bad relationship with the main character
	- When choosing a sprite, the game will...
		- prefer a matching key in the set matching the character's current sentiments.
		- If that does not exist, fallback to special.
		- If that does not exist fallback to neutral
		- If that does not exist, fallback to the "neutral" key from the neutral sprite set (required image)
- easy modification to insert custom chapters when using base game materials
	- simple data structures that can be loaded directly from files if desired
	- creating a editor for easy of story writing is highly desired.  It may be out of scope for this repo, but it will live somewhere.
- a process for more invasive mods (custom characters, and locations) will have to be full game specific and it's feasibility is pending building out the UI tools repo an starting a game repo.