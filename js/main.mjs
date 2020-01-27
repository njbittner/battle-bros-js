import {PlayState} from './playstate.mjs';

class Game extends Phaser.Game{
    constructor() {
        super(960,
            600, 
            Phaser.AUTO, 'content', null);
        this.state.add('play', PlayState);
        // name, cache, world objects, params
        this.state.start('play', true, false, {level:0});
    }
}
window.onload = function () {
    new Game();
};