import {PlayState} from './playstate.mjs';

var game = new Phaser.Game(800, 600, Phaser.CANVAS, "game");

game.state.add("playState", PlayState);
game.state.start("playState");