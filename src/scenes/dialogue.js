export const blue = 0x145bb3;;

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
            box.beginFill(blue);
            box.drawRoundedRect(0, 0, 800, 150, 5);
            box.endFill();

            // Make a white box within
            const whiteBox = this.add.graphics(box.x + 10, box.y + 10);
            whiteBox.beginFill(0xffffff);
            whiteBox.drawRoundedRect(0, 0, box.width - 20, box.height - 20, 5);
            whiteBox.endFill();

            //box.addChild(whiteBox);
            //this.textBox = box;

            // TODO: Sequentially type the text
            let textMsg;

            if (!message) {
                textMsg = speaker;
            } else {
                textMsg = `${speaker}:\n${message}`;
            }

            const text = this.add.text(15, 460, textMsg, {
                font: 'orange_kid',
                fontSize: '3em',
                fill: `#${blue.toString(16)}`
            });

            // Add a prompt: [HIT SPACE]
            const hitSpaceText = this.add.text(this.world.right - 20, this.world.bottom - 20, '[SPACE/TAP]', {
                font: 'orange_kid',
                fontSize: '3em',
                fill: text.fill
            });
            hitSpaceText.anchor.setTo(1);

            // Wait for SPACEBAR hit
            if (message !== false) {
                this.createSpacebar().onDown.addOnce(() => {
                    const shwop = this.add.sound('sounds.shwop');
                    shwop.playOnce = true;
                    shwop.play();
                    resolve();
                });
            }
        });
    }
}