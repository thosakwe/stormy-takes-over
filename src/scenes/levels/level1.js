import BattleState from '../battle';
import Enemy from '../../enemy';
import { Player, Move } from '../../player';

export default class Level1 extends BattleState {
    async create() {
        super.create();
        const sound = this.add.sound('sounds.spaceship', 1, true);
        sound.play();
        await this.showImage('screens.battle.grass');
        const stormySprite = this.createStormy();
        const sessionsSprite = this.createEnemy('profiles.sessions');

        this.stormy = new Player('STORMY', 100, stormySprite, [
            {
                name: 'GAS-LIGHT',
                damage: 40
            },
            {
                name: 'Move 1'
            },
            {
                name: 'Move 4'
            },
            {
                name: 'Move 3'
            },
        ]);

        this.enemy = new Enemy('JEFF SESSIONS', 150, sessionsSprite, []);
        await this.startLoop();
    }
}