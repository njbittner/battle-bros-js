# Top-Level Categorizations
## Game States
### State Manager -- Create, manage, swap/swich between game states
### State -- 

## Loader
### Cache -- Client-side cache where all loaded assets are read/written from at game runtime.
Cache is populated during preload step
### Loader  -- Load all assets and put them into the cache. Automatically invoked by a State's 'Preload' method.
### Loader Parser -- Used by loader to help parse complex asset types

## Game Objects
* GameObjectFactory - helper class that (1) creates any phaser Game Object and (2) adds it to the game world
* GameOjectCreator - create and return a Game Object
* Group - Container for Game objects; has methods for filtering, sorting, searching, calling, updating
* InputHandler -- Handles user input. Can only be one at a time?
* Events -- Game Object level events?

### Display
* Sprite -- Game Object with a texture, capable of running animations, input-events, and physics.
* Image -- Texture and input, but no physics or animations
### Graphics
* Lower-level control over graphics primatives, efficient rendering.
### Text
 
### Animation
* Animation Manager - adds, plays, updates animations on a SPRITE object
* Animation - base animation object
* AnimationParser - Used internally by Phaser Loader to parse animation data from external files
* FrameData - A collection of Frame objects that comprise an animation
* Frame - A single frame of an object. Stored inside FrameData container

### Physics
* Body - attached to a sprite. Logic for physics is done on body, not on sprite itself.

## Main classes
* Game -- Booting, logic loop, render loop
* World -- Container for "world obejcts"
* Camera -- Defines logic for rendering, modells a viewer
* Stage -- Root display object (the "frame" that rendered images goes to. Could be a whole canvas or GL context, could be half, etc)

## Logic and render loops are seperate things?

# Time
* Internal clock to which all time-related logic applies



# Log
* TLDR
    * Here's a high level diagram explaining how these components interact
    * Here's a highly commented block of code 
* Followed MDN tutorial
* Tried to port my own game, which has significantly more complicated logic
* Ran into issue with having multiple animations.
    * Admittedly, I don't know shit about game design, but in my Python version, I had a manager that switches between animations, and each animation index into a seperate texture
    * In Phaser (and maybe other game libraries) a sprite has a single texture.
    * I looked around online and most of the stuff I found, including this example and this forum post were rather unhelpful. Why do I need to reload a texture every time i want to switch frames?
        * this may work if you're doing a one-time switch... but if you're rapidly switching between animations, then you get this nasty side-effect.
    * I read through the API reference and then the source code.
        * API reference explaiend that Sprite.animations is an AnimationManager object.
        * Aha! A sprite's AnimationManager source code shows it does NOT have any information about textures. So the Sprite loads a texture, and then an animation just plays
        a tune on top of it. I kind of think this is a weird abstraction. Why not bundle the animation with the texture beneath the animation?
        * In general, the idea is that you'd use a Spritesheet or an Atlas instead of having multiple textures. Why? IDK. Less time reading from disk, maybe?
    * anyway, there's two ways to accmoplish this:
        * Change the texture each time you want to change the animation. and be sure to have logic that says "if this texture is already loaded, don't reload it."
        otherwise, you'll end up interrupting the animation each time you press a key, which is for sure annoying. the animation won't replay unless you reload the texture.