import BattleState from '../battle';

export default class GameOverState extends BattleState {
    init(callback) {
        this.callback = callback;
    }

    async create() {
        super.create();
        const menuSound = this.add.sound('sounds.menu');
        menuSound.play('', 0, 1, true);
        await this.showImage('screens.opening.4');
        this.camera.shake();
        await this.type('SCARAMUCCI', 'I was counting on you, but you blew it...');
        await this.type('SCARAMUCCI', "I guess the world will never be free...");
        this.type('RETRY?', false);

        const state = await this.showMenu([
            {
                name: 'NO',
                callback: async () => 'boot'
            },
            {
                name: 'YES',
                callback: async () => this.callback || 'boot'
            },
        ]);

        this.camera.onFadeComplete.addOnce(() => {
            menuSound.stop();
            this.state.start(state);
        });
        this.camera.fade();
    }
}