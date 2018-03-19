import BattleState from '../battle';
import Enemy from '../../enemy';
import { Player, Move } from '../../player';

export default class Level2 extends BattleState {
    async create() {
        super.create();
        const sound = this.add.sound('sounds.spaceship', 1, true);
        sound.play();
        await this.showImage('screens.battle.darkness');
        const stormySprite = this.createStormy();
        const sessionsSprite = this.createEnemy('profiles.trump');

        this.stormy = new Player('STORMY DANIELS', 150, stormySprite, [
            {
                name: 'COURT ORDER',
                description: 'Deals 20 dmg.\nFiles suit against the opponent.',
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
                pp: 5
            },
            {
                name: 'MICHAEL COHEN',
                description: 'Heals 35 health.\nCalls Trump\'s foo-ass lawyer.',
                heal: 35,
                pp: 2
            },
        ]);

        this.enemy = new Player('DONALD TRUMP', 225, sessionsSprite, [
            {
                name: 'FIRING SPREE',
                damage: 25,
                pp: 50
            },
            {
                name: 'CIRCULAR LOGIC',
                effect: 'CONFUSED',
                pp: 3
            },
            {
                name: 'TINY-HAND BARRAGE',
                effect: 'CONFUSED',
                damage: 25,
                pp: 8
            },
            {
                name: '#BUILDTHEWALL',
                heal: 50,
                pp: 1
            },
        ], 15);

        await this.startLoop();

        this.camera.onFadeComplete.addOnce(() => {
            sound.stop();

            if (this.stormy.sprite.alive) {
                this.state.start('trump-dialogue');
            } else {
                this.state.start('game-over', true, false, 'sessions-dialogue');
            }
        });

        this.camera.fade();
    }
}