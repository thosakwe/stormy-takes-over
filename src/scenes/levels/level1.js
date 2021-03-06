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

        this.stormy = new Player('STORMY DANIELS', 100, stormySprite, [
            {
                name: 'GAS-LIGHT',
                description: 'Deals 20 dmg.\nSpread a small, incriminating rumor.',
                damage: 20,
                pp: 20
            },
            {
                name: 'FLASH',
                effect: 'STUNNED',
                description: '50% chance of stun.\nFlashes the opponent. ;)',
                pp: 5
            },
            {
                name: 'SURPRISE LAWSUIT',
                description: 'Deals 40 dmg.\nPulls a laywer out of nowhere..',
                damage: 40,
                pp: 3
            },
            {
                name: 'QUICK HEAL',
                description: 'Heals 20 health.',
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

        this.camera.onFadeComplete.addOnce(() => {
            sound.stop();

            if (this.stormy.sprite.alive) {
                this.state.start('sessions-dialogue');
            } else {
                this.state.start('game-over', true, false, 'opening-dialogue');
            }
        });

        this.camera.fade();
    }
}