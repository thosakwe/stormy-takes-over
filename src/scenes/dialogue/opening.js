import DialogueState from '../dialogue';

export default class OpeningDialogueState extends DialogueState {
    async create() {
        const menuSound = this.add.sound('sounds.menu');
        menuSound.play('', 0, 1, true);
        await this.showImage('screens.opening.1');
        await this.type('SCARAMUCCI', 'Daniels, Stormy-san.');
        await this.type('SCARAMUCCI', "It's nice to meet you.");
        await this.type('SCARAMUCCI', 'Many have tried. Many have failed. But no one...');
        await this.type('SCARAMUCCI', 'Has *ever* managed to coup the throne.');
        await this.type('SCARAMUCCI', 'Today, that will change.');
        await this.showImage('screens.opening.2');
        await this.type('SCARAMUCCI', 'This man claims to be the strongest warrior in this land.');
        await this.type('SCARAMUCCI', 'He defeated me in combat, destroying my family\'s honor.');
        await this.type('SCARAMUCCI', 'He now spreads fear across the whole world!');
        await this.type('SCARAMUCCI', 'But is he the real enemy?');
        await this.showImage('screens.opening.3');
        await this.type('SCARAMUCCI', 'No!');
        await this.type('SCARAMUCCI', 'He is being controlled from behind the wings by evil!!!');
        await this.showImage('screens.opening.4');
        this.camera.shake();
        await this.type('SCARAMUCCI', 'STORMY-SAN!!!!!! DEFEAT THIS EVIL!!! RESTORE HONOR!!!');
        this.camera.onFadeComplete.addOnce(() => {
            menuSound.stop();
            this.state.start('level1');
        });
        this.camera.fade();
    }
}