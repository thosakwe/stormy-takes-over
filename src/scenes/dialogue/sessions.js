import DialogueState from '../dialogue';

export default class SessionsDialogueState extends DialogueState {
    async create() {
        const menuSound = this.add.sound('sounds.menu', 1, true);
        menuSound.play();
        await this.showImage('screens.sessions.2');
        await this.type('STORMY', 'Omae wa mou shindeiru.');
        await this.showImage('screens.sessions.1');
        await this.type('JEFF SESSIONS', 'NANI???');
        await this.showImage('screens.sessions.2');
        await this.type('STORMY', 'It\'s over, Jeff. I know the truth about your leader.');
        await this.type('STORMY', 'Take me to him now, and this will all be over very quickly.');
        await this.showImage('screens.sessions.1');
        await this.type('JEFF SESSIONS', 'NO!!!');
        await this.type('JEFF SESSIONS', 'I AM NO TRAITOR.');
        await this.showImage('screens.sessions.2');
        await this.type('STORMY', 'Very well. Then I guess I will have to...');
        menuSound.stop();
        await this.type('STORMY', 'KILL YOU...!');
        await this.showImage('screens.sessions.3');
        const explosion = this.add.sound('sounds.explode');
        explosion.playOnce = true;
        explosion.play();
        this.camera.shake();
        await this.type('*BOOM*');
        await this.type('???', 'ENOUGH!!!');
        await this.type('???', 'Leave this man alone.');
        await this.type('???', 'If it is me you are looking for... then so be it.');
        const bossSound = this.add.sound('sounds.boss', 0.6, true);
        bossSound.play();
        await this.showImage('screens.sessions.2');
        await this.type('STORMY', 'You must be...!');
        await this.type('STORMY', 'I am here to fight.');
        this.camera.onFadeComplete.addOnce(() => {
            bossSound.stop();
            this.state.start('battle_intro', true, false, {
                state: 'level2',
                enemy: 'profiles.trump',
                params: {}
            });
        });
        this.camera.fade();
    }
}