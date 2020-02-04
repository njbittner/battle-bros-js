import {PlayState} from './playstate.mjs';

class Game extends Phaser.Game{
    constructor() {
        super(780, 600, Phaser.AUTO, 'content', null);
        this.state.add('play', PlayState);
        this.state.start('play', true, false);
    }
}
window.onload = function () {
    new Game();
};