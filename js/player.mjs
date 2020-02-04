class Player extends Phaser.Sprite {
    constructor(game, x, y) {
        super(game, x, y, 'player');
        this.MOVEMENT_SPEED = 200;
        this.JUMP_SPEED = 600;
        this.game.physics.enable(this);
        this.anchor.set(0.5, 1);
        this.body.collideWorldBounds=true;
    }

    move(direction){
        this.body.velocity.x = direction*this.MOVEMENT_SPEED; // for physics engine.
        if (this.body.velocity.x < 0) {
            this.scale.x = -1;
        }
        else if (this.body.velocity.x > 0){
            console.log("MK");
            this.scale.x = 1;
       }
    }

    jump(){
        // let canJump = this.body.touching.down;
        console.log("jumping");
        let canJump = true;

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

    update(){
        let animationName = this._getAnimationName();
        if (this.animations.name !== animationName){
            this.animations.play(animationName);
        }
    }
}

export {Player};