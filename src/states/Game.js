/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'

export default class extends Phaser.State {
  init () {
    this.keys = this.game.input.keyboard.addKeys({
      left: Phaser.KeyCode.LEFT,
      right: Phaser.KeyCode.RIGHT,
      up: Phaser.KeyCode.UP
    })

    this.keys.up.onDown.add(function () {
      let didJump = this.player.jump()
      if (didJump) {
        // this.sfx.jump.play();
        console.log('jumpped')
      }
    }, this)
  }
  preload () { }

  create () {
    const bannerText = 'Battle Bros'
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText, {
      font: '40px Bangers',
      fill: '#77BFA3',
      smoothed: false
    })

    banner.padding.set(10, 16)
    banner.anchor.setTo(0.5)


    const GRAVITY = 1000
    this.game.physics.arcade.gravity.y = GRAVITY

    this.game.add.existing(this.player)
  }

  update () {
    this._handleInput()
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.player, 32, 32)
    }
  }

  _handleInput () {
    let direction = 0
    if (this.keys.left.isDown) {
      direction = -1
    } else if (this.keys.right.isDown) {
      direction = 1
    }
    this.player.move(direction)
  }
}
