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
    constructor(name, health, sprite, moves = [], agility = 5) {
        this.name = name;
        this.health = health;
        this.sprite = sprite;
        sprite.maxHealth = sprite.health = health;
        this.moves = moves;
        this.agility = agility;
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

            if (move._pp === undefined)
                move._pp = move.pp;

            if (move.heal && !move.effect && !move.damage && ((this.sprite.maxHealth - this.sprite.health) / move.heal) < 0.5) {
                // Don't bother healing if we are at sufficient health.
                score = 0;
            } else if (move.effect && !move.heal && !move.damage && opponent.effect) {
                // Don't bother applying an effect if one is already in place.
                score = 0;
            } else if (move._pp === 0) {
                // Don't use a move that's out of PP.
                score = 0;
            } else {
                // Prioritize strong moves.
                if (move.damage)
                    score += move.damage / 20;

                // Moves with low PP get a boost.
                if (move.pp < 5)
                    score += 3;
                else if (move.pp < 10)
                    score += 2;

                // Effects are also rewarded.
                if (move.effect)
                    score += 2;

                // Avoid repeating moves if possible.
                if (this.lastMove && move.name === this.lastMove.name)
                    score -= 2;

                // Regular moves can get a random bonus.
                else if (score === 1) {
                    score += ArrayUtils.getRandomItem([
                        0, 0, 0, 0, 1, 0, 0
                    ]);
                }

                // Give every move a chance to be chosen.
                if (score <= 0)
                    score = 1;
            }

            for (let i = 0; i < score; i++)
                pool.push(move);

            //console.info(move.name, score);
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
    async doMove(move, opponent, game, type, heedConfused = true) {
        if (!this.sprite.alive) return;

        if (this.effectDuration) {
            if (--this.effectDuration <= 0) {
                await type(`${this.name} is no longer ${this.effect}!`);
                this.effect = undefined;
                this.effectDuration = 0;
                this.sprite.tint = Phaser.Color.WHITE;
            } else if (move.damage || move.effect || move.heal) {
                if (this.effect === 'STUNNED')
                    return await type(`${this.name} is stunned and cannot attack!`);
                else if (this.effect === 'POISONED') {
                    const damage = game.rnd.between(0, 2) * 5;

                    if (damage > 0) {
                        await type(`${this.name} took ${damage} damage from poison!`);
                        await this.takeHit(game, damage);
                    }
                }
                else if (this.effect === 'CONFUSED' && move.damage) {
                    if (heedConfused)
                        await type(`${this.name} is confused! Attacks might backfire.`);

                    if ((heedConfused === false) || game.rnd.between(1, 2) === 1) {
                        await type(this.name, `${this.name}'s attack backfired! Self-hit!`);
                        this.sprite.damage(move.damage);
                        return;
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
            if (opponent.effect !== 'STUNNED' && game.rnd.between(1, 100) <= opponent.agility)
                return await type(`${opponent.name} dodged the attack!`);

            let damage = move.damage, r = game.rnd.between(1, 10);

            if (r === 1)
                damage *= 0.5;
            else if (r === 10)
                damage *= 1.5;

            damage = Math.round(damage);

            await opponent.takeHit(game, damage);

            if (r === 1)
                await type("It's not very effective...");
            else if (r === 10)
                await type("It's super effective!");
        }

        if (move.effect) {
            if (opponent.effectDuration) {
                if (!move.damage && !move.heal) {
                    await type(`${opponent.name} is already ${opponent.effect}!`);
                }
            } else {
                let choice;

                if (!move.damage && !move.heal)
                    choice = game.rnd.between(1, 2) !== 1;
                else choice = game.rnd.between(1, 4) === 1;

                if (!choice) {
                    if (!move.damage && !move.heal)
                        await type('It had no effect!');
                } else {
                    opponent.effect = move.effect;
                    opponent.effectDuration = game.rnd.between(1, 4) + 1;
                    opponent.sprite.tint = blue;
                    await type(`${opponent.name} is now ${move.effect}!`);
                }
            }
        }

        if (move.heal) {
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

