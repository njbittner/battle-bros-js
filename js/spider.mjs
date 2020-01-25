
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

Spider.prototype.die = function(){
    this.body.enable = false;
    this.animations.play('die').onComplete.addOnce(function() {
        this.kill();
    }, this);
};


export {Spider};