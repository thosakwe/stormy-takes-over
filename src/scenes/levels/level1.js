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
                damage: 10,
                pp: 20
            },
            {
                name: 'FLASH',
                effect: 'STUNNED',
                pp: 8
            },
            {
                name: 'SURPRISE LAWSUIT',
                damage: 40,
                pp: 3
            },
            {
                name: 'QUICK HEAL',
                heal: 20,
                pp: 2
            },
        ]);

        this.enemy = new Player('JEFF SESSIONS', 150, sessionsSprite, [
            {
                name: 'POLICE BRUTALITY',
                damage: 25,
                pp: 15
            },
            {
                name: 'KKKARATE CHOP',
                damage: 15,
                pp: 30
            },
            {
                name: 'WAFFLE THE QUESTION',
                effect: 'CONFUSED',
                pp: 3
            },
            {
                name: 'INSTITUTIONAL RACISM',
                heal: 40,
                pp: 1
            },
        ]);
        await this.startLoop();
    }
}