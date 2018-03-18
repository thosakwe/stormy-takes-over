export default class BootState extends Phaser.State {

    preload() {
        const game = this.game;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.refresh();
        window.onresize = game.scale.refresh.bind(game.scale);

        // Audio
        this.load.audio('sounds.boss', ['assets/sounds/boss.mp3', 'assets/sounds/boss.ogg']);
        this.load.audio('sounds.explode', ['assets/sounds/explosions/explode.mp3', 'assets/sounds/explosions/explode.ogg']);
        this.load.audio('sounds.menu', ['assets/sounds/menu.mp3', 'assets/sounds/menu.ogg']);
        this.load.audio('sounds.shwop', ['assets/sounds/shwop.mp3', 'assets/sounds/shwop.ogg']);
        this.load.audio('sounds.spaceship', ['assets/sounds/spaceship.mp3', 'assets/sounds/spaceship.ogg']);
        this.load.audio('sounds.title', ['assets/sounds/title.mp3', 'assets/sounds/title.ogg']);
        this.load.audio('sounds.whoosh', ['assets/sounds/whoosh.mp3', 'assets/sounds/whoosh.ogg']);

        // Images
        this.load.image('images.title', 'assets/images/title.png');
        this.load.image('profiles.sessions', 'assets/images/profiles/sessions.png');
        this.load.image('profiles.stormy', 'assets/images/profiles/stormy.png');
        this.load.image('profiles.stormy_battle', 'assets/images/profiles/stormy_battle.png');
        this.load.image('profiles.trump', 'assets/images/profiles/trump.png');

        // Screens
        this.load.image('screens.battle.darkness', 'assets/images/screens/battle/darkness.png');
        this.load.image('screens.battle.grass', 'assets/images/screens/battle/grass.png');
        this.load.image('screens.battle_intro', 'assets/images/screens/battle_intro.png');
        this.load.image('screens.opening.1', 'assets/images/screens/opening/1.png');
        this.load.image('screens.opening.2', 'assets/images/screens/opening/2.png');
        this.load.image('screens.opening.3', 'assets/images/screens/opening/3.png');
        this.load.image('screens.opening.4', 'assets/images/screens/opening/4.png');
        this.load.image('screens.sessions.1', 'assets/images/screens/sessions/1.png');
        this.load.image('screens.sessions.2', 'assets/images/screens/sessions/2.png');
        this.load.image('screens.sessions.3', 'assets/images/screens/sessions/3.png');
    }

    create() {
        const loader = window.document.querySelector('#load-font');
        if (loader) loader.remove();
        const titleMp3 = this.add.sound('sounds.title');
        titleMp3.play('', 0, 1, true);

        this.add.sprite(0, 0, 'images.title');

        const text = this.add.text(115, 450, 'PRESS SPACE', {
            fill: '#fff'
        });

        const timer = this.time.create();
        timer.loop(500, function () {
            if (text.fill === '#fff')
                text.fill = 'transparent';
            else text.fill = '#fff';
        });
        timer.start();

        const spacebar = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

        spacebar.onDown.addOnce(() => {
            titleMp3.stop();
            this.state.start('opening-dialogue');
            //this.state.start('level2');
        });
    }
}