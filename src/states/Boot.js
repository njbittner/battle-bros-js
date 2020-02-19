import Phaser from 'phaser'
import WebFont from 'webfontloader'
import config from '../config'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#EDEEC9'
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
  }

  preload () {
    if (config.webfonts.length) {
      WebFont.load({
        google: {
          families: config.webfonts
        },
        active: this.fontsLoaded
      })
    }

    this.text = this.add.text(this.world.centerX, this.world.centerY, 'Loading Game Assets', { font: '16px Arial', fill: '#000000', align: 'center' })
    this.text.anchor.setTo(0.5, 0.5)
    this.load.image('loaderBg', './images/loader-bg.png')
    this.load.image('loaderBar', './images/loader-bar.png')
  }

  render () {
    if (config.webfonts.length && this.fontsReady) {
      this.state.start('Splash')
    }
    if (!config.webfonts.length) {
      this.state.start('Splash')
    }
  }

  update () {
    this.text.angle += 1
  }

  fontsLoaded () {
    setTimeout(() => { this.fontsReady = true }, 200)
  }
}
