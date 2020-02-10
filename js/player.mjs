class Player extends Phaser.Sprite {
    /*
    Sprites are an essential class/concept in Phser.
    A sprite is a type containing:
        1. Coordinates
        2. A texture
        3. A 'body' attribute that enables physics and motion
        4. An InputHandler attribute via '.input'
        5. An AnimationManager attribute, '.animations'
    */
    constructor(game, x, y) {
        super(game, x, y);
        this.game.physics.enable(this); // create body for sprite
        this.anchor.set(0.0, 0.0); // Change sprite rendering info
        this.MOVEMENT_SPEED = 200;
        this.JUMP_SPEED = 600;
        this.body.collideWorldBounds=true;
    }

    move(direction){
        this.body.velocity.x = direction*this.MOVEMENT_SPEED; // for physics engine.
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
            this.body.velocity.y = -this.JUMP_SPEED;
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