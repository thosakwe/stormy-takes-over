requirejs.config({
    baseUrl: 'src'
});

requirejs(['scenes/boot'], function (BootScene) {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
    game.state.add('boot', BootScene);
    game.state.start('boot');
});