import GameOverState from './scenes/dialogue/game_over';
import OpeningDialogueState from './scenes/dialogue/opening';
import SessionsDialogueState from './scenes/dialogue/sessions';
import Level1 from './scenes/levels/level1';
import Level2 from './scenes/levels/level2';
import BattleIntroState from './battle_intro';
import BootState from './scenes/boot';

const game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
game.state.add('battle_intro', BattleIntroState);
game.state.add('boot', BootState);
game.state.add('game-over', GameOverState);
game.state.add('level1', Level1);
game.state.add('level2', Level2);
game.state.add('opening-dialogue', OpeningDialogueState);
game.state.add('sessions-dialogue', SessionsDialogueState);
game.state.start('boot');