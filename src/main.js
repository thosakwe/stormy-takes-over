import BootState from './scenes/boot';

const game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
game.state.add('boot', BootState);
game.state.start('boot');