class Level {
    level_end_x = 2160;

    constructor(enemies, clouds, backgroundObjects, coins = [], obstacles = []) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;

        // Neue Hindernisse des Levels
        this.obstacles = obstacles;
    }
}
