class Hero extends Phaser.Sprite {
    constructor(game, x, y) {
        super(game, x, y, 'hero');
        this.SPEED = 200;
        this.JUMP_SPEED = 600;
        this.game.physics.enable(this);
        this.anchor.set(0.5, 0.5);
        this.body.collideWorldBounds=true;

        this.animations.add('stop', [0]);
        this.animations.add('run', [1,2], 8, true);
        this.animations.add('jump', [3]);
        this.animations.add('fall', [4]);
    }

    move(direction){
        this.body.velocity.x = direction*this.SPEED; // for physics engine.
        if (this.body.velocity.x < 0) {
            this.scale.x = -1;
        }
        else if (this.body.velocity.x > 0){
            this.scale.x = 1;
       }
    }

    jump(){
        let canJump = this.body.touching.down;

        if (canJump){
            this.body.velocity.y = - this.JUMP_SPEED;
        }
        return canJump;
    }

    _getAnimationName(){
        let name = 'stop'; // default
        if (this.body.velocity.y < 0){
            name = 'jump';
        }
        else if (this.body.velocity.y >= 0 && !this.body.touching.down){
            name = 'fall';
        }
        else if (this.body.velocity.x != 0 && this.body.touching.down){
            name = 'run'
        }
        return name;
    }

    bounce(){
        const BOUNCE_SPEED = 200;
        this.body.velocity.y = -BOUNCE_SPEED;
    }

    update(){
        let animationName = this._getAnimationName();
        if (this.animations.name !== animationName){
            this.animations.play(animationName);
        }
    }
}

export {Hero};