import DialogueState, { blue } from './dialogue';
import { Player, Move } from '../player';

export default class BattleState extends DialogueState {
    create() {
        super.create();
        this.left = this.input.keyboard.addKey(Phaser.KeyCode.LEFT);
        this.right = this.input.keyboard.addKey(Phaser.KeyCode.RIGHT);
        this.up = this.input.keyboard.addKey(Phaser.KeyCode.UP);
        this.down = this.input.keyboard.addKey(Phaser.KeyCode.DOWN);
    }

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

    /**
     * 
     * @param {Array.<Choice>} choices
     * @returns {Promise.<Function>}
     */
    showMenu(choices) {
        return new Promise(resolve => {
            const pos = { x: this.world.right - 20, y: 470 };
            const textItems = [];
            let n = 0, i = 1, leftX = -1, rightX = -1;

            for (const choice of choices) {
                const text = this.add.text(pos.x, pos.y, choice.name, {
                    fill: `#${blue.toString(16)}`,
                    font: 'orange_kid',
                    fontSize: '3em'
                });
                textItems.push(text);
                text.anchor.x = 1;
                pos.x = text.left - 30;

                // Left-align items
                if (n % 2 === 0) {
                    // Left-most item
                    if (leftX === -1)
                        leftX = text.left;
                    else text.left = leftX;
                } else {
                    // Right-most item
                    if (rightX === -1)
                        rightX = text.left;
                    else text.left = rightX;
                }

                if (n++ === 1) {
                    pos.x = this.world.right - 20;
                    pos.y = text.bottom + 10;
                    n = 0;
                }
            }

            // Create chevron.
            // Select the first item on the left.
            let selected = textItems[textItems.length > 1 ? 1 : 0];

            function moveChevron() {
                selected.text = `*${selected.text}`;
            }

            moveChevron();

            const moveLeft = () => {
                selected.text = selected.text.substring(1);

                if (i % 2 !== 0) {
                    // If we are on the left, move right.
                    selected = textItems[--i];
                } else {
                    selected = textItems[++i];
                }

                moveChevron();
            };
            this.left.onDown.add(moveLeft);

            const moveRight = () => {
                selected.text = selected.text.substring(1);
                if (i % 2 === 0) {
                    // If we are on the right, move left.
                    selected = textItems[++i];
                } else {
                    selected = textItems[--i];
                }

                moveChevron();
            };
            this.right.onDown.add(moveRight);

            const moveUp = () => {
                selected.text = selected.text.substring(1);
                if (i < 2) {
                    // If we are on the top, go back to the bottom.
                    if (i !== 1)
                        i = textItems.length - 2;
                    else
                        i = textItems.length - 1;
                    selected = textItems[i];
                } else {
                    selected = textItems[i -= 2];
                }

                moveChevron();
            };
            this.up.onDown.add(moveUp);

            const moveDown = () => {
                selected.text = selected.text.substring(1);
                if (i >= textItems.length - 2) {
                    // If we are on the bottom, go back to the top.
                    if (i !== textItems.length - 2)
                        i = 1;
                    else i = 0;
                    selected = textItems[i];
                } else {
                    selected = textItems[i += 2];
                }

                moveChevron();
            };
            this.down.onDown.add(moveDown);

            this.createSpacebar().onDown.addOnce(() => {
                const choice = choices[i];
                this.left.onDown.remove(moveLeft);
                this.right.onDown.remove(moveRight);
                this.down.onDown.remove(moveDown);
                this.up.onDown.remove(moveUp);

                for (const text of textItems) {
                    text.kill();
                }

                if (choice.callback) {
                    return (async () => {
                        return resolve(await choice.callback(() => {
                            this.showMenu(choices);
                        }));
                    })();
                } else if (choice.submenu && choice.submenu.length) {
                    return this.showMenu(choice.submenu).then(resolve);
                }
            });
        });
    }

    /**
     * 
     * @param {Player} player 
     */
    async showMainMenu(player) {
        this.type('What will STORMY do?', false);
        return await this.showMenu([
            {
                name: 'TAUNT',
                callback: () => this.type('STORMY', 'UMADBRO???')
            },
            {
                name: 'FIGHT',
                callback: () => {
                    if (!player || !player.moves || !player.moves.length)
                        return this.type('STORMY', 'STORMY has no moves available to use.');
                    return this.showMenu(player.moves.map(move => {
                        return {
                            name: move.name,
                            callback: () => move
                        };
                    }));
                }
            },
            {
                name: 'RUN',
                callback: async () => {
                    this.type('REALLY run away from this battle???', false);
                    return await this.showMenu([
                        {
                            name: 'NO',
                            callback: (back) => back()
                        },
                        {
                            name: 'YES',
                            callback: () => this.type('STORMY', "I'm NOT a quitter!!!")
                        },
                    ]);
                }
            },
            {
                name: 'SUE',
                callback: () => this.type('STORMY', 'LAWSUIT POWAHH!!!!')
            },
        ]);
    }

    async startLoop() {
        while (true) {
            await this.showMainMenu();
        }
    }
}

/**
 * @typedef Choice
 * @type {object}
 * @property {string} name
 * @property {Function} callback
 * @property {Array.<Choice>} submenu
 */