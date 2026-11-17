/**
 * Verwaltet Sammelobjekte, Gegnerkontakte und Schaden.
 * Die World behält Kamera, Spielschleife und Endzustand.
 */
class CollisionManager {
    constructor(world) {
        this.world = world;
    }

    /** Prueft alle Arten von Beruehrungen. */
    checkCollisions() {
        this.collectCoins();
        this.collectBottles();
        this.world.enemies.forEach((enemy) => this.checkEnemyCollision(enemy));
        this.checkBossCollision();
    }

    /** Eine Muenze kann nur einmal gesammelt werden. */
    collectCoins() {
        const world = this.world;
        world.coins.forEach((coin) => {
            if (coin.isRemoved || !world.character.isColliding(coin)) return;
            coin.isRemoved = true;
            world.collectedCoins++;
            audioManager.playSound('coin');
            GameUI.updateHUD(world);
        });
    }

    /** Flaschen aktualisieren Vorrat und HUD. */
    collectBottles() {
        const world = this.world;
        world.bottles.forEach((bottle) => {
            if (bottle.isRemoved || !world.character.isColliding(bottle)) return;
            bottle.isRemoved = true;
            world.bottleCount++;
            audioManager.playSound('coin');
            GameUI.updateHUD(world);
        });
    }

    /** Normaler Gegner: Kopfsprung oder Seitenschaden. */
    checkEnemyCollision(enemy) {
        if (enemy.isDead || enemy.isRemoved) return;
        const collision = this.world.character.isColliding(enemy);
        if (collision && !enemy.wasColliding) this.reportCollision(enemy);
        enemy.wasColliding = collision;
    }

    /** Der Endboss verletzt Pico bei Beruehrung. */
    checkBossCollision() {
        const world = this.world;
        if (world.endboss.isDead) return;
        if (world.character.isColliding(world.endboss)) this.damageCharacter(20);
    }

    /** Nur gueltige Kopfspruenge besiegen normale Chicken. */
    reportCollision(enemy) {
        const world = this.world;
        if (!(enemy instanceof Chicken) || !world.character.isStomping(enemy)) {
            return this.damageCharacter(20);
        }
        enemy.die();
        world.character.speedY = 410;
        world.emitParticles(enemy.x + 50, enemy.y + 20, '#57f5ff');
        audioManager.playSound('bandit');
    }

    /** Schaden mit einer Sekunde Trefferschutz. */
    damageCharacter(amount) {
        const world = this.world;
        if (GameState.now() - world.lastDamageAt < 1000) return;
        world.lastDamageAt = GameState.now();
        world.energy = Math.max(0, world.energy - amount);
        world.character.hit();
        GameUI.updateHUD(world);
        if (world.energy <= 0) world.endGame(false);
    }
}
