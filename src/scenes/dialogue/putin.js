import BattleState from '../battle';

export default class PutinDialogueState extends BattleState {
    async create() {
        super.create();
        const titleSound = this.add.sound('sounds.title', 1, true);
        titleSound.play();
        await this.showImage('screens.putin.1');
        await this.type('VLADIMIR PUTIN', 'Alas, it seems my reign is at an end.');
        await this.type('VLADIMIR PUTIN', 'Goodbye, cruel world.');
        await this.type('VLADIMIR PUTIN', '... Hope you miss me...');
        await this.type('VLADIMIR PUTIN', '*dies*');
        await this.showImage('screens.opening.4');
        this.camera.shake();
        await this.type('SCARAMUCCI', 'Stormy! You\'ve restored honor!!!');
        await this.type('SCARAMUCCI', 'You are now...');
        await this.showImage('screens.putin.2');
        this.camera.shake();
        await this.type('SCARAMUCCI', 'PRESIDENT OF THE WORLD!!!');
        await this.type('Finally, the world was at peace.');
        await this.type('War had ceased, because those who started them were gone.');
        await this.type('All was finally well.');
        await this.type('STORMY', "And so, that's the story of how I took over!!!");
        await this.showImage('screens.putin.3');
        await this.type('BARACK OBAMA', 'We once again have a sensible leader in office.');
        this.type('TOBE OSAKWE\nSpecial thanks to:\n* opengameart.org', false);

        const finalMenu = () => {
            return this.showMenu([
                {
                    name: 'FORK ON GITHUB',
                    callback: () => {
                        window.open('https://github.com/thosakwe/stormy-takes-over');
                        return finalMenu();
                    }
                },
                {
                    name: 'FOLLOW ON TWITTER',
                    callback: () => {
                        window.open('https://twitter.com/thosakwe');
                        return finalMenu();
                    }
                },
                {
                    name: 'RETURN TO MENU',
                    callback: async () => {
                        this.camera.onFadeComplete.addOnce(async () => {
                            titleSound.stop();
                            this.state.start('boot');
                        });

                        this.camera.fade();
                    }
                },
                {
                    name: 'YOUTUBE',
                    callback: () => {
                        window.open('https://www.youtube.com/channel/UC8KR8RVM2wNq8auc7AOAgDA');
                        return finalMenu();
                    }
                },
            ]);
        };

        finalMenu();
    }
}