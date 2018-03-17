export default class DialogueState extends Phaser.State {
    createSpacebar() {
        return this.spacebar || (this.spacebar = this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR));
    }

    showImage(key) {
        return new Promise(resolve => {
            this.camera.onFadeComplete.addOnce(() => {
                this.world.killAll();
                this.add.sprite(0, 0, key);
                this.camera.onFlashComplete.addOnce(resolve);
                this.camera.flash();
            });

            this.camera.fade();
        });
    }

    type(speaker, message) {
        return new Promise(resolve => {
            // Make a blue box, 800x150
            const box = this.add.graphics(0, 450);
            box.beginFill(0x145bb3);
            box.drawRect(0, 0, 800, 150);
            box.endFill();

            // TODO: Sequentially type the text
            const text = this.add.text(10, 460, `${speaker}:\n${message}`, {
                font: 'orange_kid',
                fontSize: '3em',
                fill: '#fff'
            });

            // Add a prompt: [HIT SPACE]
            const hitSpaceText = this.add.text(this.world.right - 20, this.world.bottom - 20, '[HIT SPACE]', {
                font: text.font,
                fontSize: text.fontSize,
                fill: text.fill
            });
            hitSpaceText.anchor.setTo(1);

            // Wait for SPACEBAR hit
            this.createSpacebar().onDown.addOnce(() => {
                const shwop = this.add.sound('sounds.shwop');
                shwop.playOnce = true;
                shwop.play();
                resolve();
            });
        });
    }
}