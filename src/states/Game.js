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
  preload () {
    this.player = new Player({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'player1_sheet'
    })
    this._loadPlayerAnimationAtlas()
  }

  _loadPlayerAnimationAtlas () {
    this.player.animations.add('swim', Phaser.Animation.generateFrameNames('attack/attack1/Kombat_0000000001_000000001_00006.png"', 7, 9, 'png'), 30, true);

    // this.player.animations.add(
    //   'move',
    //   [
    //     {key: 'player1_sheet', frame: 'movement/movement1/Kombat_0000000001_000000001_00042.png'},
    //     {key: 'player1_sheet', frame: 'movement/movement1/Kombat_0000000001_000000001_00043.png'},
    //     {key: 'player1_sheet', frame: 'movement/movement1/Kombat_0000000001_000000001_00044.png'}
    //   ],
    //   6,
    //   true
    // )
  }

  create () {
    const bannerText = 'Battle Bros'
    let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText, {
      font: '40px Bangers',
      fill: '#77BFA3',
      smoothed: false
    })

    banner.padding.set(10, 16)
    banner.anchor.setTo(0.5)

    this.game.physics.arcade.gravity.y = 1000

    this.game.add.existing(this.player)
    this.player.animations.play('swim')
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
