/** Enthaelt saemtliche Objekte eines Levels. */
class Level {
    constructor(enemies, clouds, backgroundObjects, coins, bottles, obstacles, endboss, forge = null) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
        this.obstacles = obstacles;
        this.endboss = endboss;
        this.forge = forge;
        this.level_end_x = 2480;
    }
}
