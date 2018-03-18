import BattleState from '../battle';

export default class Level1 extends BattleState {
    async create() {
        super.create();
        const sound = this.add.sound('sounds.spaceship', 1, true);
        sound.play();
        await this.showImage('screens.battle.grass');
        const stormy = this.createStormy();
        const session = this.createEnemy('profiles.sessions');
        await this.type('SESSIONS', 'A wild JEFF SESSIONS appeared!');
        await this.startLoop();
    }
}