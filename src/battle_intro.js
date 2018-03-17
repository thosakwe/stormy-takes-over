export default class BattleIntroState extends Phaser.State {
    /**
     * 
     * @param {BattleIntroStateConfig} config 
     */
    init(config) {
        this.config = config;
        this.config.state = this.config.state || 'battle';
        this.config.params = this.config.params || {};
    }

    create() {
        this.add.image(0, 0, 'screens.battle_intro');
        this.camera.onFlashComplete.addOnce(() => {
            // Add stormy profile
            const stormy = this.add.sprite(100, this.world.bottom, 'profiles.stormy');
            stormy.anchor.setTo(0.5, 1);
            stormy.scale.setTo(-0.5, 0.5);

            // Add enemy profile
            const enemy = this.add.sprite(this.world.right - 100, this.world.bottom, this.config.enemy);
            enemy.anchor.setTo(0.5, 1);
            enemy.scale.setTo(0.5);

            const whoosh = this.add.sound('sounds.whoosh');
            whoosh.onStop.addOnce(() => {
                const timer = this.time.create();
                timer.add(2000, () => {
                    this.camera.onFadeComplete.addOnce(() => {
                        this.state.start(this.config.state, true, false, this.config.params);
                    });
                    this.camera.fade();
                });
                timer.start();
            });
            whoosh.play();
        });
        this.camera.flash();
    }
}

/**
 * @typedef BattleIntroStateConfig
 * @type {object}
 * @property {string} enemy - The enemy profile to display.
 * @property {string} state - The state to navigate to next. Defaults to 'battle'.
 * @property {object} params - The parameters to pass to the next state.
 */