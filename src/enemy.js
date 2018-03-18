import {Player, Move} from './player';

export default class Enemy extends Player {
    /**
     * 
     * @param {string} name The player's name.
     * @param {number} health
     * @param {Phaser.Sprite} sprite
     * @param {Move[]} moves The moves available for the player.
     */
    constructor(name, health, sprite, moves = []) {
        super(name, health, sprite, moves);
    }
}