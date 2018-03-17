import OpeningDialogueState from './scenes/dialogue/opening';
import Level1 from './scenes/levels/level1';
import BattleIntroState from './battle_intro';
import BootState from './scenes/boot';

const game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
game.state.add('battle_intro', BattleIntroState);
game.state.add('boot', BootState);
game.state.add('level1', Level1);
game.state.add('opening-dialogue', OpeningDialogueState);
game.state.start('boot');