class Level {
    level_end_x = 2160;

    constructor(enemies, clouds, backgroundObjects, coins = [], obstacles = [], forge = null) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.obstacles = obstacles;

        // Die Schmiede ist ein eigenes Levelobjekt
        this.forge = forge;
    }
}
