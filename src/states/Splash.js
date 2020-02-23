import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

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

    this.game.player = new Player({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      asset: 'player'
    })
    this._loadPlayerAnimationAtlas();
  }

  _loadPlayerAnimationAtlas(){

    this.load.atlas('player', 'spritesheets/nate_spritesheet.png', 'spritesheets/nate_spritesheet.json')

    var movement_1 = {
         key: 'movement_1',
         frames: [
             {key: "player1_sheet", frame: "movement/movement1/Kombat_0000000001_000000001_00042.png"},
             {key: "player1_sheet", frame: "movement/movement1/Kombat_0000000001_000000001_00043.png"},
             {key: "player1_sheet", frame: "movement/movement1/Kombat_0000000001_000000001_00044.png"}
         ],
         framerate: 6,
         repeat: true
     };
    this.game.player.animations.create(animation)
  }

  create () {
    this.state.start('Game')
  }
}
