import {Spider} from './spider.mjs';
import {Hero} from './hero.mjs';
const LEVEL_COUNT = 2;

class PlayState {
    init(data){
        this.level = (data.level || 0) %  LEVEL_COUNT;
        this.keys = this.game.input.keyboard.addKeys({
            left: Phaser.KeyCode.LEFT,
            right: Phaser.KeyCode.RIGHT,
            up: Phaser.KeyCode.UP
        });
        // Disable anti-aliasing for non-integer coords.
        // Force phaser to round the pixel positions to be ints.
        this.game.renderer.renderSession.roundPixels=true;

        this.keys.up.onDown.add(function() {
            let didJump = this.hero.jump();
            if (didJump){
                this.sfx.jump.play();
            }
        }, this);

        this.score = 0;
        this.hasKey = false;
    }

    preload(){
        this.game.load.json("level:0", 'data/level00.json');
        this.game.load.json("level:1", 'data/level01.json');
        this.game.load.image("background", "images/background.png");

        // environment sprites
        this.game.load.image('ground', 'images/ground.png');
        this.game.load.image('grass:8x1', 'images/grass_8x1.png');
        this.game.load.image('grass:6x1', 'images/grass_6x1.png');
        this.game.load.image('grass:4x1', 'images/grass_4x1.png');
        this.game.load.image('grass:2x1', 'images/grass_2x1.png');
        this.game.load.image('grass:1x1', 'images/grass_1x1.png');
        // invisible walls
        this.game.load.image('invisible-wall', 'images/invisible_wall.png');

        // Coin Spritesheet
        // Last two numbers are dimension of each frame.
        this.game.load.spritesheet('coin', 'images/coin_animated.png', 22,22);
        // Spider spritesheet
        this.game.load.spritesheet('spider', 'images/spider.png', 42, 32);
        // character spritesheet
        this.game.load.spritesheet('hero', 'images/hero.png', 36, 42);
        // Door
        this.game.load.spritesheet('door', 'images/door.png', 42, 66);
        // key in hud
        this.game.load.spritesheet('icon:key', 'images/key_icon.png', 34, 30);

        // Audio
        // jump noise
        this.game.load.audio('sfx:jump', 'audio/jump.wav');
        // pick-up coin noise
        this.game.load.audio('sfx:coin', 'audio/coin.wav');
        this.game.load.audio("sfx:stomp", 'audio/stomp.wav');
        this.game.load.audio('sfx:key', 'audio/key.wav');
        this.game.load.audio('sfx:door', 'audio/door.wav');

        // For scoreboard
        this.game.load.image('icon:coin', 'images/coin_icon.png');
        this.game.load.image("font:numbers", "images/numbers.png");

        // key
        this.game.load.image('key', 'images/key.png');
    }

    _createHud(){
        this.keyIcon = this.game.make.image(0, 19, 'icon:key');
        this.keyIcon.anchor.set(0, 0.5);
        let coinIcon = this.game.make.image(this.keyIcon.width + 7,0, 'icon:coin');
        this.hud = this.game.add.group()
        this.hud.add(coinIcon);
        this.hud.position.set(10,10);

        const NUMBERS_STR = '0123456789X';
        this.coinFont = this.game.add.retroFont('font:numbers', 20, 26, // w,h, of each character.
            NUMBERS_STR, 6);
        let coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width,
            coinIcon.height / 2, this.coinFont);
        coinScoreImg.anchor.set(0, 0.5);

        this.hud.add(coinScoreImg);

        this.hud.add(this.keyIcon);
    }

    create(){
        this.game.add.image(0,0, 'background');
        this._loadLevel(this.game.cache.getJSON(`level:${this.level}`));

        this.sfx = {
            jump: this.game.add.audio('sfx:jump'),
            coin: this.game.add.audio('sfx:coin'),
            stomp: this.game.add.audio('sfx:stomp'),
            key: this.game.add.audio('sfx:key'),
            door: this.game.add.audio('sfx:door')
        };
        this._createHud();
    }

    update(){
        this._handleCollisions();
        this._handleInput();
        this.coinFont.text = `x${this.score}`;
        this.keyIcon.frame = this.hasKey ? 1: 0;
    }

    _handleCollisions(){
        this.game.physics.arcade.collide(this.hero, this.platforms);
        this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin,
            null, this); // null is for optional filter function.
        this.game.physics.arcade.collide(this.spiders, this.platforms);
        this.game.physics.arcade.collide(this.spiders, this.invisibleWalls);
        this.game.physics.arcade.overlap(this.hero, this.spiders,
            this._onHeroVsEnemy, null, this);
        this.game.physics.arcade.overlap(this.hero, this.key, 
            this._onHeroVsKey, null, this);
        this.game.physics.arcade.overlap(this.hero, this.door,
            this._onHeroVsDoor, function(hero, door){
                return this.hasKey && hero.body.touching.down; // put condition on this event
            }, this);
    }

    _onHeroVsKey(hero, key){
        this.sfx.key.play();
        key.kill();
        this.hasKey = true;
    }

    _onHeroVsDoor(hero, door){
        this.sfx.door.play();
        this.game.state.restart(true, false, {level: this.level+1});
    }

    _onHeroVsEnemy(hero, spider){
        if (hero.body.velocity.y > 0) {
            spider.die();
            this.sfx.stomp.play(); 
            hero.bounce();
        }
        else {
            this.sfx.stomp.play();
            this.game.state.restart(true, false, {level: this.level});
        }

    }

    _onHeroVsCoin(hero, coin){
        this.sfx.coin.play();
        coin.kill();  // deletes sprite? removes from rendering at very least
        this.score++;
    }

    _loadLevel(data){
        this.bgDecoration = this.game.add.group();
        // create groups / layers
        this.platforms = this.game.add.group();
        this.coins = this.game.add.group();
        this.spiders = this.game.add.group();
        this.invisibleWalls = this.game.add.group();
        this.invisibleWalls.visible = false;

        // create platforms
        data.platforms.forEach(this._spawnPlatform, this);
        data.coins.forEach(this._spawnCoin, this);

        this._spawnCharacters({hero: data.hero, spiders:data.spiders});

        // Enable gravity
        const GRAVITY = 1200;
        this.game.physics.arcade.gravity.y = GRAVITY;

        // create door, key
        this._spawnDoor(data.door.x, data.door.y);
        this._spawnKey(data.key.x, data.key.y);
    }

    _spawnDoor(x,y){
        this.door = this.bgDecoration.create(x,y, 'door');
        this.door.anchor.setTo(0.5, 1);
        this.game.physics.enable(this.door); // needed for detecting overlap
        this.door.body.allowGravity = false;
    }

    _spawnKey(x,y){
        this.key = this.bgDecoration.create(x,y, 'key');
        this.key.anchor.set(0.5, 0.5);
        this.game.physics.enable(this.key);
        this.key.body.allowGravity=false;

        // TWEEN.
        this.key.y -=3
        this.game.add.tween(this.key)
            .to({y:this.key.y+6}, 800, Phaser.Easing.Sinusoidal.InOut)
            .yoyo(true)
            .loop()
            .start();
    }

    _spawnCharacters(data){
        //hero
        this.hero = new Hero(this.game, data.hero.x, data.hero.y);
        this.game.add.existing(this.hero);

        // spiders
        data.spiders.forEach(function(spider){
            let sprite = new Spider(this.game, spider.x, spider.y);
            this.spiders.add(sprite);
        }, this);

    }

    _spawnPlatform(platform){
        let sprite = this.platforms.create(
            platform.x, platform.y, platform.image);
        this.game.physics.enable(sprite);
        // this line has to come after the previous one.
        // otherwise body won't exist.
        sprite.body.allowGravity=false;
        sprite.body.immovable = true;
        this._spawnInvisibleWall(platform.x, platform.y, 'left');
        this._spawnInvisibleWall(platform.x + sprite.width, platform.y, 'right');
    }

    _spawnInvisibleWall(x,y,side) {
        let sprite = this.invisibleWalls.create(x,y, 'invisible-wall');
        // anchor, y displacement
        sprite.anchor.set(side === 'left' ? 1 : 0, 1);

        this.game.physics.enable(sprite);
        sprite.body.immovable = true;
        sprite.body.allowGravity = false;
    }

    _spawnCoin(coin){
        let sprite = this.coins.create(coin.x, coin.y, 'coin');
        sprite.anchor.set(0.5, 0.5);
        sprite.animations.add('rotate', [0,1,2,1], 6, true); // 6fps, loop
        sprite.animations.play('rotate');
        this.game.physics.enable(sprite);
        sprite.body.allowGravity = false;
    }

    _handleInput(){
        if (this.keys.left.isDown){
            this.hero.move(-1);
        }
        else if (this.keys.right.isDown){
            this.hero.move(1);
        }
        else {
            this.hero.move(0);
        }
    }

}
export {PlayState as PlayState};