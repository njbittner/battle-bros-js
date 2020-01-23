PlayState = {};

PlayState.init = function () {
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
};

PlayState.preload = function(){
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

    // Character sprite
    this.game.load.image('hero', 'images/hero_stopped.png');

    // Coin Spritesheet
    // Last two numbers are dimension of each frame.
    this.game.load.spritesheet('coin', 'images/coin_animated.png', 22,22);
    // Spider spritesheet
    this.game.load.spritesheet('spider', 'images/spider.png', 42, 32);

    // Audio
    // jump noise
    this.game.load.audio('sfx:jump', 'audio/jump.wav');
    // pick-up coin noise
    this.game.load.audio('sfx:coin', 'audio/coin.wav');
};

PlayState.create = function() {
    this.game.add.image(0,0, 'background');
    this._loadLevel(this.game.cache.getJSON('level:1'));

    this.sfx = {
        jump: this.game.add.audio('sfx:jump'),
        coin: this.game.add.audio('sfx:coin')
    };
};

PlayState.update = function(){
    this._handleCollisions();
    this._handleInput();
};

PlayState._handleCollisions = function(){
    this.game.physics.arcade.collide(this.hero, this.platforms);
    this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin,
        null, this); // null is for optional filter function.
    this.game.physics.arcade.collide(this.spiders, this.platforms);
    this.game.physics.arcade.collide(this.spiders, this.invisibleWalls);
};

PlayState._onHeroVsCoin = function(hero, coin){
    this.sfx.coin.play();
    coin.kill();  // deletes sprite? removes from rendering at very least
};

PlayState._loadLevel = function(data){
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
};

PlayState._spawnCharacters = function(data) {
    //hero
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.game.add.existing(this.hero);

    // spiders
    data.spiders.forEach(function(spider){
        let sprite = new Spider(this.game, spider.x, spider.y);
        this.spiders.add(sprite);
    }, this);

};

PlayState._spawnPlatform = function(platform){
    let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);
    this.game.physics.enable(sprite);
    // this line has to come after the previous one.
    // otherwise body won't exist.
    sprite.body.allowGravity=false;
    sprite.body.immovable = true;
    this._spawnInvisibleWall(platform.x, platform.y, 'left');
    this._spawnInvisibleWall(platform.x + sprite.width, platform.y, 'right');
};

PlayState._spawnInvisibleWall = function(x,y,side){
    let sprite = this.invisibleWalls.create(x,y, 'invisible-wall');
    // anchor, y displacement
    sprite.anchor.set(side === 'left' ? 1 : 0, 1);

    this.game.physics.enable(sprite);
    sprite.body.immovable = true;
    sprite.body.allowGravity = false;
}

PlayState._spawnCoin = function(coin){
    let sprite = this.coins.create(coin.x, coin.y, 'coin');
    sprite.anchor.set(0.5, 0.5);
    sprite.animations.add('rotate', [0,1,2,1], 6, true); // 6fps, loop
    sprite.animations.play('rotate');
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
};

PlayState._handleInput = function(){
    if (this.keys.left.isDown){
        this.hero.move(-1);
    }
    else if (this.keys.right.isDown){
        this.hero.move(1);
    }
    else {
        this.hero.move(0);
    }
};


// Hero constructor, overriding the sprite interace.
function Hero(game, x, y){
    // Phasor.Sprite
    Phaser.Sprite.call(this, game, x, y, 'hero');
    this.game.physics.enable(this);
    this.anchor.set(0.5, 0.5);
    this.body.collideWorldBounds=true;
};

Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;
Hero.prototype.move = function(direction){
    const SPEED = 200;
    // this.x += direction*2.5; // per-frame in pixels.
    this.body.velocity.x = direction*SPEED; // for physics engine.
};

Hero.prototype.jump = function(){
    const JUMP_SPEED = 600;
    // Very cool method to check if bottom of sprite
    // is in contact with anything
    let canJump = this.body.touching.down;

    if (canJump){
        this.body.velocity.y = -JUMP_SPEED;
    }
    return canJump;
};


function Spider(game, x,y){
    // call parent init
    Phaser.Sprite.call(this, game, x, y, 'spider');

    // anchor
    this.anchor.set(0.5); // what dim is this?
    //animation
    this.animations.add('crawl', [0, 1, 2], 8, true);
    this.animations.add('die', [0,4,0,4,0,4,3,3,3,3,3,3], 12, false);
    this.animations.play('crawl');

    // physics
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.velocity.x = Spider.SPEED;
}
Spider.SPEED = 100;
Spider.prototype = Object.create(Phaser.Sprite.prototype);
Spider.prototype.constructor = Spider;

Spider.prototype.update = function() {
    // check walls -- touching for other spites, blocked for world bounds?
    if (this.body.touching.right || this.body.blocked.right){
        this.body.velocity.x = -Spider.SPEED;
    }
    else if (this.body.touching.left || this.body.blocked.left){
        this.body.velocity.x = Spider.SPEED;
    }
};

window.onload = function () {
    let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
    game.state.add('play', PlayState);
    game.state.start('play');
};