class Level {
    // Ende unseres ersten Levels
    level_end_x = 2160;

    constructor(enemies, clouds, backgroundObjects, coins = []) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;

        // Sammelbare Muenzen des Levels
        this.coins = coins;
    }
}
