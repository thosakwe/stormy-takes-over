export class Player {
    /**
     * 
     * @param {string} name The player's name.
     * @param {Move[]} moves The moves available for the player.
     */
    constructor(name, moves = []) {
        this.name = name;
        this.moves = moves;
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

