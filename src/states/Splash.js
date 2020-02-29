import Phaser from 'phaser'
import { centerGameObjects } from '../utils'
import Player from '../sprites/Player'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    // this.load.image('player', 'spritesheets/lose1.png')
    this.load.atlas('player1_sheet', 'spritesheets/nate_spritesheet.png', 'spritesheets/nate_spritesheet.json')
  }

  create () {
    this.state.start('Game')
  }
}
