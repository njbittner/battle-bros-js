import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({game, x, y, asset}) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)
    this.game.physics.enable(this)
    this.MOVEMENT_SPEED = 200
    this.JUMP_SPEED = 600
  }

  _move (direction) {
    this.body.velocity.x = direction * this.MOVEMENT_SPEED
    if (this.body.velocity.x < 0) {
      this.scale.x = -1
    } else if (this.body.velocity.x > 0) {
      this.scale.x = 1
    }
  }

  _jump () {
    let canJump = this.body.touching.down
    if (canJump) {
      this.body.velocity.y = -this.JUMP_SPEED
    }
    return canJump
  }
  update () {
    this.angle += 1
  }
}
