/** Legt die Startwerte für das Level fest. */
class WorldSetup {
    constructor(world) {
        this.world = world;
    }

    /** Holt Gegner, Münzen und andere Dinge ins Level. */
    loadLevel() {
        const game = this.world;
        game.enemies = game.level.enemies;
        game.clouds = game.level.clouds;
        game.backgroundObjects = game.level.backgroundObjects;
        game.coins = game.level.coins;
        game.bottles = game.level.bottles;
        game.obstacles = game.level.obstacles;
        game.endboss = game.level.endboss;
        game.forge = game.level.forge;
        game.levelWidth = game.level.level_end_x;
    }

    /** Setzt Pico in die Spielwelt. */
    createCharacter() {
        const game = this.world;
        game.character = new Character(game.keyboard);
        game.character.levelWidth = game.levelWidth;
        game.character.obstacles = game.obstacles;
    }

    /** Erstellt die Balken am Bildschirm. */
    createStatusBars() {
        const game = this.world;
        game.playerBar = new StatusBar(16, 30, 160, '#ff497b', 'LEBEN');
        game.bottleBar = new StatusBar(195, 30, 100, '#43e6db', 'FLASCHEN');
        game.bossBar = new StatusBar(430, 30, 270, '#b65aff', 'ENDBOSS');
    }

    /** Bereitet eine neue Spielrunde vor. */
    prepareGame() {
        const game = this.world;
        this.resetCounters();
        game.projectiles = [];
        game.particles = [];
        game.disposed = false;
        game.lastFrameAt = 0;
        game.lastAboveGround = false;
        game.frameId = requestAnimationFrame((now) => game.draw(now));
    }

    /** Setzt Punkte, Leben und Flaschen zurück. */
    resetCounters() {
        const game = this.world;
        game.cameraX = 0;
        game.energy = 100;
        game.collectedCoins = 0;
        game.coinsSpent = 0;
        game.bottleCount = 0;
        game.lastThrowAt = 0;
        game.lastDamageAt = -Infinity;
        game.throwWasDown = false;
        game.ended = false;
    }
}
