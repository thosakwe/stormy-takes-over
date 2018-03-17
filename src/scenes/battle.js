import DialogueState, {blue} from './dialogue';

export default class BattleState extends DialogueState {
    /**
     * 
     * @param {string} key 
     * @returns {Phaser.Sprite}
     */
    createEnemy(key) {
        const sprite = this.add.sprite(600, 180, key);
        sprite.anchor.setTo(0.5, 1);
        sprite.scale.setTo(0.5);
    }

    /**
     * 
     * @returns {Phaser.Sprite}
     */
    createStormy() {
        const sprite = this.add.sprite(215, 460, 'profiles.stormy_battle');
        sprite.anchor.setTo(0.3, 1);
        sprite.scale.setTo(0.75);
    }

    async startLoop() {
        while (true) {
            await this.type('What will STORMY do?');


        }
    }
}