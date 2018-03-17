export default class BootState extends Phaser.State {

    preload() {
        const game = this.game;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.refresh();
        window.onresize = game.scale.refresh.bind(game.scale);

        this.load.audio('sounds.title', 'assets/sounds/title.mp3');
        this.load.image('images.title', 'assets/images/title.png');
    }

    create() {
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
    }
}