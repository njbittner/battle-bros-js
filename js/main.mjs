window.PIXI   = require('phaser-ce/build/custom/pixi');
window.p2     = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');

import {PlayState} from './playstate.mjs';

var game = new Phaser.Game(800, 600, Phaser.CANVAS, "game");

game.state.add("playState", PlayState);
game.state.start("playState");