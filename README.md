# Visual-Novel-Engine
What it says on the tin.  I'm building out my own engine so I can add more complex mechanics to it while still keeping the codebase light and fast.
This part of the project is JUST the story engine.  Eventually, there will be a separate repo for UI logic in javascript and maybe one more for a fully implemented UI.  That last bit may only exist in my own fully fleshed out story project.  Not sure yet.

## [Working Minimal Demo](https://neurobio.github.io/Ballast-Visual-Novel-Engine/)


# Design Decisions
## Engine

### Main Responsibilities
i.e. the things the engine does by default; the implementation is not customizable
- Beginning specified Chapter
- Beginning next Scene (as dictated by Chapter OR save data)
- Playing specified Beat and applying its affects on save data
	- Updating Active Chapter(s) queued scenes
	- Updating character traits + memories
	- Updating inventory items + their quantity
	- unlocking Achievements
	- unlocking chapters
	- returns data for UI to display (UI concerns NOT covered in this repo)
		- text + char name for dialog
		- characters to add, move, remove, or change sprite
		- save data actions like unlock chapter, unlock achievement. ect
			- the engine handles saving, but this allows for e.g. displaying an achievement unlocked banner
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

## Saving
### When to Save
Autosaves occur when scenes are completed.  Manual saves via `engine.save` are designed to be called before scenes start or after scene complete, but NOT during them.  The save data currently does not contain the data necessary to support mid-scene saves.  The following is missing:
- Save data does not store the current beat a user is on (necessary to restart partway through a scene).
- Save data does not store an old copy of its prior state (necessary for rollback).
Currently, scene restarts are quick rollbacks that use the prior save state stored _in memory_.  The following is an example of what can go wrong if you save midway through a scene:

- Player gain an item in a scene.
- Player to manually saves
- Player quits and reloads the game
- The scene restarts at beat 1
- The player begins the scene from the start with the item the obtained from partial play-through in their inventory.

Tracking the prior state for save data and the current beat to allow for mid-scene saves and rollbacks is a possible future enhancement.

### When to load save data manually
If you have a simple game, you never need to manually call `engine.loadSavedData`.  When starting a scene/chapter on a new engine, save data is automatically loaded or created.  When using the same engine instance across scenes, the engine holds onto an in memory copy of the save data's state before starting the scene and its current state.  The engine sets the prior save data state as a clone of the current save data state upon starting a new scene/chapter to allow for quick scene restarts.

If you have a more complex game where save data changes outside of the engine's local memory and the engine needs to respect these changes, then you want to call `engine.loadSavedData` prior to starting a scene/chapter to make sure the engine has the latest state for the save data.  Note that `loadSavedData` is limited by the same caveat for timing as `save`: it's designed to be called before or after a scene.  Not during a scene.

### Save Data Structure
- Active Chapters
	- the queued chapter will be equivalent to the engine's current chapter most of the time
	- the two disconnect when a final beat dictates what the next scene should be
	- Once a chapter is complete, it is removed from Active Chapters and moves to Completed Chapters
- Characters
	- memories: key for a specific beat; allows referencing events across chapters
		- e.g: you helped a character, so they can bring that up later (or act differently if you if not help)
	- traits: dict of "traits" and their numeric values (e.g. `like: .324`)
		- referenced across chapters to affect general responses, display sprite sets, or relationship-driven branches
		- has no max or min value
	- Characters are always checked against the game data.
		- If a character in the game data is missing from the save data, it is added to the save data.
		- Once a character is in the save data, the game data cannot overwrite it
- Inventory
	- Items are mostly for use in PnC parts of a game, but this allows items to be gained/lost in conversation

```typescript
{
	activeChapters: { [chapterKey: string]: string },
	unlockedChapters: string[],
	completedChapters: string[],
	inventory: { [itemKey: string]: number },
	achievements: string[],
	characters: [{
		name: string,
		key: string,
		traits: { [key:string]: number },
		memories: string[],
	}],
}
```


## Beats
"Beats" are VN story units.  Chapters are composed of one or more scenes.  Scenes are composed of beats, where each beat or it's child options (i.e. choice, branch, or response) provides the UI with display text or a user decision.  Events that affect save data, like unlocking chapters or changing character traits, are assigned/occur at the beat level.  All beats inherit the same event capabilities.  However, when "played", they handle their UI display components differently and decide what to return to the UI based on unique logic.

Note: "conditional" choices reference save data (characters and/or inventory) for conditions.  See the interfaces for single options conditions and cross option conditions below.

### Simple Beat
Owns one set of text.  Returns that and the next beat.  There is no real logic here.

```typescript
{
	key: string,
	defaultBehavior: {
		character?: string,
		text: string,
		nextBeat: string,
		sceneData: {}, // see below
	},
	saveData?: {}, // see below
}
```

### First Fit Branch Beat
Owns a set of branches, but *ONLY ONE* will be returned to the user.  All branches have conditional choices, and teh beat returns the first branch whose condition is satisfied.  Requires a default option with no conditions.  These beats are for redirecting the story based on the user decisions that did not occur in the prior beat (i.e. the beat decides what path to take).  Typically, these beats hinge on conditions satisfied in prior scenes and chapters, though there could be within scene uses.

```typescript
{
	key: string,
	branches: [ // min 1
		{
			character?: string,
			text: string,
			nextBeat: string,
			conditions: SingleOptionCondition[], // min 1
			sceneData: {}, // see below
		}
	],
	defaultBehavior: {
		character?: string,
		text: string,
		nextBeat: string,
		sceneData: {}, // see below
	},
	saveData?: {}, // see below
}
```

### Best Fit Branch Beat
Owns a set branches, but *ONLY ONE* will be returned to the user.  Choses the branch whose character has the greatest or least value for the beat's cross option condition. All branches must have a character.  Branches are permitted to also have single option conditions.  If the same character is present on multiple branches or multiple character satisfy the cross condition, the first valid branch is used.  In other words: this Beat type uses First Fit to resolve ties.

Example setup:
```
cross condition: Character with greatest friendship

characters:
- Enemy: friendship = -0.5
- Friend2: friendship = 1
- Friend: friendship = 1

branches:
- Enemy: condition met
- Friend: condition1 failed
- Friend: condition2 met
- Friend2: condition met
- Friend: condition3 met
```

After checking which branches satisfy their own conditions, we are left with:
```
branches:
- Enemy: condition met
- Friend: condition2 met**
- Friend2: condition met
- Friend: condition3 met
```

Friend and Friend2 both satisfy greatest friendship cross condition.  However, Friend has a branch before Friend 2, so the Friend beat with condition2 is used.

```typescript
{
	key: string,
	branches: [ // min 2
		{
			character: string, // this is the one beat where character is required
			text: string,
			nextBeat: string,
			conditions: SingleOptionCondition[],
			sceneData: {}, // see below
		}
	],
	defaultBehavior?: { // required when all choices are conditional
		character?: string,
		text: string,
		nextBeat: string,
		sceneData: {}, // see below
	},
	crossBranchCondition: CrossOptionCondition,
	saveData?: {}, // see below
}

```

### Multi Response Beat
Owns a set of responses and iterates through them when possible.  The beat type is very fluid compared to the others.  Its primary use case is to allow for one story beat to lead to many beats that are conditional but expected to be in a set order  (e.g. play 1, optionally 2, and then 3).  Although this pattern can be achieved with branch beats, it is hard to keep track of that way and requires many beats, as shown in the following example.

```
choice => branch 1
	=> conditional response 1 => branch 2
		=> conditional response
		=> always
	=> conditional response 2 => always
	=> always
```

The more conditional responses there are, the harder this is to maintain.  If the responses are multi-beat chains, this becomes even more convoluted.  Multi Response beats flatten the above into:

```
choice 1 => multi response
	=> conditional response 1 => ...multi response
	=> conditional response 2 => ...multi response
	=> always
```

Where `...` can lead directly back to the multi-response beat (intended default behavior), or it can branch off into a longer chain that ends by manually returning to the multi response beat (or not).  To branch off, a response will declare its next beat.  To immediately play the next allowed response, next beat should not be declared on the response.

To deal with the uncertainty of whether conditional responses play, if they lack a next beat, the last allowed beat to play inherits its next beat from the default behavior.  All beats earlier in the chain will return the parent multi response beat as their next beat.  Default behavior is always required for this beat type, since it will fail to play if all responses have already been played and there is no default to fallback on.

Currently, conditions are only checks the FIRST time a multi-response beat is called.  So if a condition becomes untrue by the next call the response will still show.  Changing behavior to recheck conditionals each call is a possible future enhancement.

```typescript
{
	key: string,
	responses: [ // min 2
		{
			text: string,
			nextBeat?: string,
			character?: string,
			conditions?: SingleOptionCondition[],
			sceneData: {}, // see below
		}
	],
	defaultBehavior: {
		character?: string,
		text: string,
		nextBeat: string,
		sceneData: {}, // see below
	},
	saveData?: {}, // see below
}
```

### Choice Beat
In short, this is where the user controls game play.  Owns a set of choices.  Returns choices marked as "mayPlay" true or false.  The default behavior also returns when no choices may be played.  Conditional choices must be satisfied to return with mayPlay: true (defaulted to true for unconditional choices).  When all choices are conditional, a default option is required.

The decision was made to always return all choices so the UI can make decisions about the unplayable choices.  This suits the following use cases:
- display include the unplayable choices grayed out and un-selectable
- display may signal to user that other choices would have been available without stating what they are
	- current personal plans: show a lock icon + the number of unplayable choices
Currently, the reason _why_ a choice may not be played is NOT returned, but this would be a possible future enhancement.

```typescript
{
	key: string,
	choices: [ // min 2
		{
			text: string,
			nextBeat: string,
			conditions?: SingleOptionCondition[],
		}
	],
	defaultBehavior?: { // required when all choices are conditional
		character?: string,
		text: string,
		nextBeat: string,
		sceneData: {}, // see below
	},
	saveData?: {}, // see below
}
```


### Final Beat
Owns one set of text.  A next beat will not be defined.  All scenes MUST end on a final beat.  This limitation exists on the assumption that the story never needs to end on a choice or branch beat.  That should be easy enough to achieve, but if a story should require ending on a choice or branch beat, a final beat is allowed to return an empty string.  A UI could respond to empty strings by automatically calling `advancedScene` again.

```typescript
{
	defaultBehavior: {
		character?: string,
		text: string,
		sceneData: {}, // see below
	},
	saveData?: {}, // see below
}
```

### Configuring Conditions
Currently, all conditional arrays assume AND states.  Because all single option conditions have an opposite condition (e.g. has/lacks memory), X and NOT Y can be achieved.  OR is not cleanly supported, but can be achieved with single Options conditionals.  Example: show a choice if X AND/OR Y is true.
```
choice 1: X AND NOT Y
choice 2: Y AND NOT X
choice 3: X AND Y
```
Assume choices 1-3 lead to the same result.  The AND NOT sections are to ensure that the same choice does not return 3 times when X and Y are true.  In a first response branch beat, just `branch 1: X` and `branch 2: Y` would be sufficient, as only the first true branch is returned.

AND/OR logic is NOT supported for the Best Fit Branch's cross option conditions (only one may exist on a Best Fit Branch Beat).  However, you CAN apply single option conditions on branches for Best Fit Branches.  E.g. Say you wanted to have the character in a scene with the highest romance that does not have a breakup memory to say something.  You can combine `GREATEST_SENTIMENT` on the beat with `CHARACTER_UNAWARE` set on each branch.

#### Single Option Conditions

```typescript
enum Types {
	AT_LEAST_ITEM = 'itemEqual+',
	AT_MOST_ITEM = 'itemEqual-',
	CHARACTER_AWARE = 'hasMemory',
	CHARACTER_UNAWARE = 'lacksMemory',
	AT_LEAST_CHAR_TRAIT = 'charTraitEqual+',
	AT_MOST_CHAR_TRAIT = 'charTraitEqual-',
	CHARACTER_PRESENT = 'charPresent',
	CHARACTER_ABSENT = 'charAbsent',

}

AT_LEAST_ITEM/AT_MOST_ITEM
{
	type: string, //enum value
	item: string,
	quantity: number,
}

CHARACTER_AWARE/CHARACTER_UNAWARE
{
	type: string, //enum value
	character: string,
	memory: string,
}

AT_LEAST_CHAR_TRAIT/AT_MOST_CHAR_TRAIT
{
	type: string, //enum value
	character: string,
	trait: string,
	value: number,
}
```

#### Cross-Option Conditions (Best Fit Beat Only)

```typescript
enum Types {
	GREATEST_SENTIMENT = 'charMost',
	LEAST_SENTIMENT = 'charLeast',
}

GREATEST_SENTIMENT/LEAST_SENTIMENT
{
	type: string, //enum value
	trait: string;
}

```

## Side Effects
"Side effects" means any save data changes or display scene changes a beat results in.  All of them are optional.  You can apply side effects on all beat types.  Scene changes are stored on the option level for responses and branches and the top level for other beat types.  Choices do not allow for display side effects, but the default behavior on a choice beat DOES.  Save data side effects are stored on the beat level.  In other words, you cannot tie save data side effects to a specific branch, choice, or response.  In scenarios where you want option-specific save data side effects, wait until the next beat plays to apply the save side effects.

### Save Data Side Effects
```typescript
{
	queuedScenes: [{
		chapterKey: string,
		sceneKey: string,
	}];
	unlockedChapters: string[];
	unlockedAchievements: string[];
	addedItems: [{
		item: string,
		quantity: number,
	}];
	removedItems: [{
		item: string,
		quantity: number,
	}];
	addedMemories: [{
		character: string,
		memory: string,
	}];
	removedMemories: [{
		character: string,
		memory: string,
	}];
	updatedCharacterTraits: [{
		character: string,
		trait: string,
		change: number,
	}];
}
```

### Scene Side Effects
```typescript
setBackground: string;

updateCharacterSprites: [{
	character: string,
	sprite: string,
}];

moveCharacters: [{
	character: string,
	newPosition: number
}];

removeCharacters: [{ character: string }];

addCharacters: [{
	character: string,
	position: number,
	sprite: string
}];
```
Listed in order of how the sister ui package (Ballast-VN-UI) will apply changes.  The engine also keeps track of added and removed characters for conditions.  It keeps track of no other scene data.  Edge cases like "What if I want to display the same character multiple times?" are a UI problem.  The engine considers add/remove operations as all-or-nothing.  A character is either added or removed.  If you add a character twice and remove them once, the engine will believe the character is not present.  TBeats are more than happy to hold duplicate or even conflicting data however.

# Intended Use-Cases that are not Typical of VNs
- Allow non-linear, randomized story structure
- building relationships with characters is NOT based on choosing the right branch from a small number of choice branches (doing so would interfere with the non-linear storyline needs).  "Traits" are built incrementally on almost every choice made.  Expected change range 0.001-0.005.  You can use numbers with more decimal places, but they will be rounded to 3 places.  A warning about potential inaccuracy logs to the console if you do this.  There are very few make-or-break decisions, and they are very obvious (e.g. killing a character).
-  sprite sets shift depending on traits.  The UI will have to be built to support this, but the trait structure is built to support this concept:
	- the base sprite set is "neutral"
	- one off sprites for special scenes are "special"
	- additional sets could be "friend," "partner," "enemy," ect
		- additional sets have matching keys to the neutral set
		- e.g. if neutral has an "angry" sprite, then the "angry" sprite in the enemy set would look more angry because the characters have a bad relationship with the main character
	- When choosing a sprite, the game will...
		- prefer a matching key in the set matching the character's current traits.
		- If that does not exist, fallback to special.
		- If that does not exist fallback to neutral
		- If that does not exist, fallback to the "neutral" key from the neutral sprite set (required image)
- easy modification to insert custom chapters when using base game materials
	- simple data structures that can be loaded directly from files if desired
	- creating a editor for easy of story writing is highly desired.  It may be out of scope for this repo, but it will live somewhere.
- a process for more invasive mods (custom characters, and locations) will have to be full game specific and it's feasibility is pending building out the UI tools repo an starting a game repo.
