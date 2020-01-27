import {Spider} from './spider.mjs';
import {Hero} from './hero.mjs';

class PlayState {
    init(data){
        // this.keys = this.game.input.keyboard.addKeys({
        //     p1_left: Phaser.KeyCode.LEFT,
        //     p1_right: Phaser.KeyCode.RIGHT,
        //     p1_up: Phaser.KeyCode.UP,
        //     p1_down: Phaser.KeyCode.DOWN,
        //     p1_block: Phaser.KeyCode.O,
        //     p1_attack: Phaser.KeyCode.P,

        //     p2_left: Phaser.KeyCode.A,
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
        this.game.load.image("background", "backgrounds/grid_bg.png");
        // Spritesheets
        // this.game.load.spritesheet('player1', 'images/hero.png', 36,42);
        this.game.load.spritesheet('player1', 'spritesheets/lose1.png', 176,179);
    }

    create(){
        this.game.add.image(0,0, 'background');
        var player1 = this.game.add.sprite(300, 200, 'player1');
        var lose = player1.animations.add('lose');
        player1.animations.play('lose', 10, true);

        // this.sfx = {
        //     jump: this.game.add.audio('sfx:jump'),
        // };
        // this._createHud();
    }

    update(){
        // this._handleInput();
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

    // _handleInput(){
    //     return false;
    //     if (this.keys.left.isDown){
    //         this.hero.move(-1);
    //     }
    //     else if (this.keys.right.isDown){
    //         this.hero.move(1);
    //     }
    //     else {
    //         this.hero.move(0);
    //     }
    // }

}
export {PlayState as PlayState};