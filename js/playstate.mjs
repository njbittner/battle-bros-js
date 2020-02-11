import {Player} from './player.mjs';

class PlayState {
    init(data){
        this.keys = this.game.input.keyboard.addKeys({
            left: Phaser.KeyCode.LEFT,
            right: Phaser.KeyCode.RIGHT,
            up: Phaser.KeyCode.UP
        });

        this.keys.up.onDown.add(function() {
            let didJump = this.player.jump();
            if (didJump){
                //this.sfx.jump.play();
                console.log("jumpped");
            }
        }, this);
        // this.keys = this.game.input.keyboard.addKeys({
        //     p1_left: Phaser.KeyCode.LEFT,
        //     p1_right: Phaser.KeyCode.RIGHT,
        //     p1_up: Phaser.KeyCode.UP,
        //     p1_down: Phaser.KeyCode.DOWN,
        //     p1_block: Phaser.KeyCode.O,
        //     p1_attack: Phaser.KeyCode.P,
        // });

        // //     p2_left: Phaser.KeyCode.A,
        //     p2_right: Phaser.KeyCode.D,
        //     p2_up: Phaser.KeyCode.W,
        //     p2_down: Phaser.KeyCode.S,
        //     p2_block: Phaser.KeyCode.X,
        //     p2_attack: Phaser.KeyCode.C
        // });

        // Disable anti-aliasing for non-integer coords.
        // Force phaser to round the pixel positions to be ints.
        // this.game.renderer.renderSession.roundPixels=true;
        // this.winner = false;
    }

    preload(){
        /*
        game.load invokes the PhaserLoader which stores data in a local cache for later reading. You
        do this ahead of time so that when the game starts you have everything already on the client, giving
        the user a smooth experience./gr

        So we are just loading assets into the cache, they are not being used by the game until the "create" step.
        */
        // Load static textures
        this.game.load.image("background", "backgrounds/grid_bg.png");
        // Load Spritesheets
        this.game.load.spritesheet('player1_lose', 'spritesheets/lose1.png', 176,179);
        this.game.load.spritesheet('player1_win', 'spritesheets/spritesheet_win.png', 208,189);
        // this.game.load.atlas('player1_sheet', 'spritesheets/nate_spritesheet.png', 'spritesheets/nate_spritesheet.json');
    }

    create(){
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        /*
        Read assets from cache and apply them to the Game by creating World Objects, which will be inside the game's
        World class. The World class is a container for game objects

        The "add" method means "create a game object with the GameObjectFactory and add it to this game's World container"
        */
        // this.game.world.setBounds(100, 100, 400, 400)
        //this.game.add.image(0, 0, 'background');
        // Create a sprite world object explicity (not using the GameObjectFactory?)
        this.player = new Player(this.game, 200, 200);
        // Since we made the sprite (which inherits from GameObject) ourselves, we have to add it as an "existing" object
        // to the game's world contaienr.
        this.game.add.existing(this.player);
        this.game.physics.enable(this.player);
        this._initalize_animations(); // TODO: move this to the Player class
        // player.animations is an AnimationManger obejct. AnimationManagers contain Animation objects.
        // the key passed to "animations.play" must have been registered (added) to the animation manager earlier
        // with the "animations.add('key')" function.
        // Note that if an animation is already playing, calling "animations.play" does not make it restart.
        // If you ever want to restart the animation, you have to do it directly with the animation Object itself.
        this.player.animations.play('player1_win'); // play is a Sprite

        // Enable gravity
        const GRAVITY = 1000;
        this.game.physics.arcade.gravity.y = GRAVITY;

        // this.sfx = {
        //     jump: this.game.add.audio('sfx:jump'),
        // };
        // this._createHud();
        this.floor = this.game.add.sprite(0, 400, 'background');
        //floor.anchor.set(0, 0)
        this.game.physics.enable(this.floor);
        this.floor.body.immovable = true;
        this.floor.body.allowGravity = false;
        //floor.visible = false;
    }

    update(){
        this._handleCollisions();
    }

    _handleCollisions(){
        this.game.physics.arcade.collide(this.player, this.floor);
    }

    _initalize_animations(){
        this.player.loadTexture('player1_win');
        this.player.animations.add('player1_win');

        this.player.loadTexture('player1_lose');
        this.player.animations.add('player1_lose', frames=[...Array(3).keys()]);;
        // var movement_1 = {
        //     key: 'movement_1',
        //     frames: [
        //         {key: "player1_sheet", frame: "movement/movement1/Kombat_0000000001_000000001_00042.png"},
        //         {key: "player1_sheet", frame: "movement/movement1/Kombat_0000000001_000000001_00043.png"},
        //         {key: "player1_sheet", frame: "movement/movement1/Kombat_0000000001_000000001_00044.png"}
        //     ],
        //     framerate: 6,
        //     repeat: true
        // };
        // this.player.animations.create(movement_1);

    }

    update(){
        this._handleInput();
    }

    // _createHud(){
    //     this.keyIcon = this.game.make.image(0, 19, 'icon:key');
    //     this.keyIcon.anchor.set(0, 0.5);
    //     let coinIcon = this.game.make.image(this.keyIcon.width + 7,0, 'icon:coin');
    //     this.hud = this.game.add.group()
    //     this.hud.add(coinIcon);
    //     this.hud.position.set(10,10);

    //     const NUMBERS_STR = '0123456789X';
    //     this.coinFont = this.game.add.retroFont('font:numbers', 20, 26, // w,h, of each character.
    //         NUMBERS_STR, 6);
    //     let coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width,
    //         coinIcon.height / 2, this.coinFont);
    //     coinScoreImg.anchor.set(0, 0.5);

    //     this.hud.add(coinScoreImg);
    //     this.hud.add(this.keyIcon);
    // }

    _handleInput(){
        let direction = 0;
        let key = '';
        if (this.keys.left.isDown){
            key = 'player1_win';
            direction = -1;
        }
        else if (this.keys.right.isDown){
            key = 'player1_lose';
            direction = 1;
        }
        this.player.move(direction);
        if (key != ''){
            if (this.player.texture.baseTexture != this.cache.getBaseTexture(key)){
                this.player.loadTexture(key);
                this.player.play(key, 3, true);
            }
        }
    }
}
export {PlayState as PlayState};