import BattleState from '../battle';
import Enemy from '../../enemy';
import { Player, Move } from '../../player';

export default class Level3 extends BattleState {
    async create() {
        super.create();
        const sound = this.add.sound('sounds.boss', 0.6, true);
        sound.play();
        await this.showImage('screens.battle.kremlin');
        const stormySprite = this.createStormy();
        const sessionsSprite = this.createEnemy('profiles.putin');

        this.stormy = new Player('STORMY DANIELS', 200, stormySprite, [
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
                name: 'ULTIMATE LAWSUIT',
                description: 'Deals 50 dmg.\nPulls TWO laywers out of nowhere...\nMAY confuse the opponent.',
                damage: 50,
                effect: 'CONFUSED',
                pp: 5
            },
            {
                name: 'CHRIS HAYES INTERVIEW',
                description: 'Heals 40 health.\nGains a little publicity from MSNBC.',
                heal: 35,
                pp: 2
            },
        ]);

        this.enemy = new Player('VLADIMIR PUTIN', 250, sessionsSprite, [
            {
                name: 'PROPAGANDA PISTOL',
                damage: 10,
                pp: 50
            },
            {
                name: 'NERVE AGENT',
                effect: 'POISONED',
                pp: 3
            },
            {
                name: 'ELECTION TAMPERING',
                effect: 'STUNNED',
                damage: 150,
                pp: 1
            },
            {
                name: 'SUSPICIOUS RE-ELECTION',
                heal: 75,
                pp: 1
            },
        ], 30);

        await this.startLoop();

        this.camera.onFadeComplete.addOnce(() => {
            sound.stop();

            if (this.stormy.sprite.alive) {
                this.state.start('putin-dialogue');
            } else {
                this.state.start('game-over', true, false, 'trump-dialogue');
            }
        });

        this.camera.fade();
    }
}