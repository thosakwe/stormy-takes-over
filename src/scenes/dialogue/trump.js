import DialogueState from '../dialogue';

export default class TrumpDialogueState extends DialogueState {
    async create() {
        const menuSound = this.add.sound('sounds.menu', 1, true);
        menuSound.play();
        await this.showImage('screens.trump.1');
        await this.type('DONALD TRUMP', 'NO!!!!! How can this be?');
        await this.showImage('screens.sessions.2');
        await this.type('STORMY', "You're going where Jeff went. Any last words?");
        await this.showImage('screens.trump.1');
        await this.type('DONALD TRUMP', '...');
        await this.type('DONALD TRUMP', 'Yes.');
        await this.type('DONALD TRUMP', '...');
        await this.showImage('screens.opening.2');
        await this.type('DONALD TRUMP', 'LOSER!');    
        await this.type('DONALD TRUMP', '*dies*');
        await this.showImage('screens.opening.1');
        await this.type('SCARAMUCCI', 'Stormy! You\'ve defeated the president.');
        await this.type('SCARAMUCCI', 'But to gain real power...\nYou need to defeat the man who really runs this nation.');
        await this.showImage('screens.opening.4');
        this.camera.shake();
        await this.type('SCARAMUCCI', 'STORMY-SAN!!!!!! HEAD TO THE KREMLIN AND FINISH THIS!!!');
        this.camera.onFadeComplete.addOnce(() => {
            menuSound.stop();
            this.state.start('battle_intro', true, false, {
                state: 'level3',
                enemy: 'profiles.putin',
                params: {}
            });
        });
        this.camera.fade();
    }
}