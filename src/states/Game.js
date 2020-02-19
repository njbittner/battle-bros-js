/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'
import lang from '../lang'

export default class extends Phaser.State {
  init () { }
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

    this.player = new Player({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'player'
    })

    this.game.add.existing(this.player)
  }

  render() {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.player, 32, 32)
    }
  }
}
