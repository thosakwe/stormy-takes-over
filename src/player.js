import { ArrayUtils } from "phaser-ce";
import { blue } from "./scenes/dialogue";

export class Player {
    /**
     * @type {string}
     */
    effect;

    /**
     * @type {number}
     */
    effectDuration;

    /**
     * @type {Move}
     */
    lastMove;

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
     * Simple algorithm for choosing a move automatically.
     * @param {Player} opponent
     * @returns {Promise.<Move>}
     */
    takeTurn(opponent) {
        let pool = [];

        for (const move of this.moves) {
            let score = 1;

            if (move.heal && (this.sprite.maxHealth - this.sprite.health) < move.heal) {
                // Don't bother healing if we are at sufficient health.
                score = 0;
            } else if (move.effect && opponent.effect) {
                // Don't bother applying an effect if one is already in place.
                score = 0;
            } else if (move._pp === 0) {
                // Don't use a move that's out of PP.
                score = 0;
            } else {
                // Prioritize strong moves.
                score += move.damage / ~10;

                // Effects are also rewarded.
                if (move.effect)
                    score++;

                // Avoid repeating moves if possible.
                if (move === this.lastMove)
                    score -= 2;

                // Give every move a chance to be chosen.
                if (score <= 0)
                    score = 1;
            }

            for (let i = 0; i < score; i++)
                pool.push(move);
        }

        if (!pool.length)
            pool = pool.concat(this.moves);

        return this.lastMove = ArrayUtils.getRandomItem(pool);
    }

    /**
     * 
     * @param {Move} move 
     * @param {Player} opponent 
     * @param {Phaser.Game} game
     * @param {Function} type 
     */
    async doMove(move, opponent, game, type) {
        if (!this.sprite.alive) return;

        if (this.effectDuration) {
            if (--this.effectDuration <= 0) {
                await type(`${this.name} is no longer ${this.effect}!`);
                this.effect = undefined;
                this.effectDuration = 0;
                this.sprite.tint = Phaser.Color.WHITE;
            } else if (move.damage || move.effect) {
                if (this.effect === 'STUNNED')
                    return await type(`${this.name} is stunned and cannot attack!`);
                else if (this.effect === 'CONFUSED') {
                    await type(`${this.name} is confused! Attacks might backfire.`);

                    if (game.rnd.between(1, 2) === 1) {
                        await this.doMove(move, this, game, type);
                        return this.type(this.name, `${this.name}'s attack backfired! Self-hit!`);
                    }
                } else {
                    //await type(`${JSON.stringify(move)}`);
                }
            }
        }

        if (--move._pp < 0)
            move._pp === 0;

        await type(`${this.name} used ${move.name}!`);

        if (move.damage) {
            await opponent.takeHit(game, move.damage);
            // TODO: Show damage
        } else if (move.effect) {
            if (opponent.effectDuration || game.rnd.between(1, 4) === 1) {
                await type('It had no effect!');
            } else {
                opponent.effect = move.effect;
                opponent.effectDuration = game.rnd.between(1, 3) + 1;
                opponent.sprite.tint = blue;
                await type(`${opponent.name} is now ${move.effect}!`);
            }
        } else if (move.heal) {
            this.sprite.heal(move.heal);
            await type(`${this.name} healed ${move.heal} health!`);
        }
    }
}

/**
 * @typedef Move
 * @type {object}
 * @property {string} name The name of the move.
 * @property {number} damage The amount of damage done by default.
 * @property {string} effect
 * @property {number} pp The available PP.
 */

