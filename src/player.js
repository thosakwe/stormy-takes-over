export class Player {
    /**
     * 
     * @param {string} name The player's name.
     * @param {number} health
     * @param {Phaser.Sprite} sprite
     * @param {Move[]} moves The moves available for the player.
     */
    constructor(name, health, sprite, moves = []) {
        this.name = name;
        this.health = health;
        this.sprite = sprite;
        sprite.maxHealth = sprite.health = health;
        this.moves = moves;
    }

    /**
     * 
     * @param {Phaser.Game} game 
     */
    async flash(game) {
        return new Promise(resolve => {
            const timer = game.time.create();
            timer.add(250, () => {
                this.sprite.visible = true;
                resolve();
            });
            this.sprite.visible = false;
            timer.start();
        });
    }

    /**
     * 
     * @param {Phaser.Game} game
     * @param {number} damage
     */
    async takeHit(game, damage) {
        // Briefly flash the sprite twice
        for (let i = 0; i < 2; i++)
            await this.flash(game);

        // Apply damage
        this.sprite.damage(damage);
    }

    /**
     * @param {Player} opponent
     * @returns {Promise.<Move>}
     */
    takeTurn(opponent) {

    }
}

export class Move {
    /**
     * 
     * @param {string} name The name of the move.
     * @param {number} damage The amount of damage done by default.
     * @param {number} pp The available PP.
     */
    constructor(name, damage, pp) {
        this.name = name;
        this.damage = damage;
        this.pp = pp;
    }
}

