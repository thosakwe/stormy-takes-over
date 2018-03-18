import DialogueState, { blue } from './dialogue';
import { Player } from '../player';

const green = 0x4ca433;

export default class BattleState extends DialogueState {
    /**
     * @type {Player}
     */
    stormy;

    create() {
        super.create();
        this.left = this.input.keyboard.addKey(Phaser.KeyCode.LEFT);
        this.right = this.input.keyboard.addKey(Phaser.KeyCode.RIGHT);
        this.up = this.input.keyboard.addKey(Phaser.KeyCode.UP);
        this.down = this.input.keyboard.addKey(Phaser.KeyCode.DOWN);
    }

    /**
     * 
     * @param {Player} player 
     * @param {boolean} right Show HUD to the right
     * @returns {Hud}
     */
    createHud(player) {
        const hud = {};
        let x, anchor;

        if (right) {
            x = player.sprite.centerX + 20;
            anchor = 0;
        } else {
            x = player.sprite.left - 20;
            anchor = 1;
        }

        const text = hud.text = this.add.text(x, player.sprite.top, `${player.name}`, {
            font: 'orange_kid',
            fontSize: '3em',
            fill: '#fff'
        });
        text.anchor.x = anchor;
        text.anchor.y = 0;
        console.info(text.text);

        const bar = hud.bar = this.add.graphics(text.left, text.bottom + 5);
        bar.beginFill(green);
        bar.drawRect(0, 0, text.width, 8);
        bar.endFill();

        return hud;
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
        return sprite;
    }

    /**
     * 
     * @returns {Phaser.Sprite}
     */
    createStormy() {
        const sprite = this.add.sprite(215, 460, 'profiles.stormy_battle');
        sprite.anchor.setTo(0.3, 1);
        sprite.scale.setTo(0.75);
        return sprite;
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
                if (false) {
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
                selected.text = `* ${selected.text}`;
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
                    return choice.callback().then(resolve);
                } else if (choice.submenu && choice.submenu.length) {
                    return this.showMenu(choice.submenu).then(resolve);
                }
            });
        });
    }

    /**
     * 
     * @param {Player} player
     * @returns {Promise.<Move>}
     */
    async showMainMenu(player) {
        this.type('What will STORMY do?', false);
        return await this.showMenu([
            {
                name: 'RUN',
                callback: async () => {
                    this.type('REALLY run away from this battle???', false);
                    return await this.showMenu([
                        {
                            name: 'NO',
                            callback: () => this.showMainMenu(player)
                        },
                        {
                            name: 'YES',
                            callback: () => this.type('STORMY', "I'm NOT a quitter!!!")
                        },
                    ]);
                }
            },
            {
                name: 'FIGHT',
                callback: () => {
                    if (!player || !player.moves || !player.moves.length)
                        return this.type('STORMY', 'STORMY has no moves available to use.');
                    return this.showMenu(player.moves.map(move => {
                        if (move._pp === undefined)
                            move._pp = move.pp;

                        return {
                            name: `${move.name} (${move._pp}/${move.pp} PP)`,
                            callback: async () => {
                                if (move._pp <= 0) {
                                    await this.type(`${move.name} is out of PP!`);
                                    return await this.showMainMenu(player);
                                }

                                return move;
                            }
                        };
                    }));
                }
            },
        ]);
    }


    async startLoop() {
        await this.type(`A wild ${this.enemy.name} appeared!`);
        this.stormyHud = this.createHud(this.stormy, true);
        this.enemyHud = this.createHud(this.enemy);

        while (this.stormy.sprite.alive && this.enemy.sprite.alive) {
            let move = await this.showMainMenu(this.stormy);

            if (move) {
                await this.stormy.doMove(move, this.enemy, this.game, this.type.bind(this));
            }

            move = await this.enemy.takeTurn(this.stormy);

            if (move) {
                await this.enemy.doMove(move, this.stormy, this.game, this.type.bind(this));
            }
        }

        if (!this.stormy.sprite.alive) {
            await this.type(`${this.enemy.name} has defeated STORMY!`);
        } else {
            await this.type(`${this.enemy.name} was defeated!`);
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

 /**
  * @typedef Hud
  * @type {object}
  * @property {Phaser.Text} text
  * @property {Phaser.Graphics} bar
  */