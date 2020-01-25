window.onload = function () {
    let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
    game.state.add('play', PlayState);
    // name, cache, world objects, params
    game.state.start('play', true, false, {level:0});
};