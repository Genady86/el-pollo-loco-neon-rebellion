/**
 * Verantwortlich fuer Flaschenwuerfe und Treffer.
 * Alle Spielwerte bleiben in World, damit sich das Verhalten nicht aendert.
 */
class ProjectileManager {
    constructor(world) {
        this.world = world;
    }

    /** Ein Wurf pro Tastendruck, mit kurzer Abklingzeit. */
    checkThrowInput() {
        const world = this.world;
        const pressed = world.keyboard.THROW;
        const allowed = GameState.now() - world.lastThrowAt >= 350;
        if (pressed && !world.throwWasDown && allowed) this.throwBottle();
        world.throwWasDown = pressed;
    }

    /** Wirft eine vorhandene Flasche in Blickrichtung. */
    throwBottle() {
        const world = this.world;
        if (world.bottleCount <= 0) return;
        const direction = world.character.otherDirection ? -1 : 1;
        const x = world.character.x + (direction > 0 ? 85 : 0);
        world.projectiles.push(new ThrowableObject(x, world.character.y + 50, direction));
        world.bottleCount--;
        world.lastThrowAt = GameState.now();
        GameUI.updateHUD(world);
    }

    /** Aktualisiert Flaschen und entfernt zerbrochene Objekte. */
    updateProjectiles(dt) {
        const world = this.world;
        world.projectiles.forEach((bottle) => {
            if (bottle.isRemoved) return;
            bottle.update(dt);
            this.checkProjectileHit(bottle);
        });
        world.projectiles = world.projectiles.filter((bottle) => !bottle.isRemoved);
    }

    /** Prueft Rand, Hindernisse, Gegner und Endboss. */
    checkProjectileHit(bottle) {
        const world = this.world;
        if (bottle.x < 0 || bottle.x > world.levelWidth || bottle.y > 450) return this.breakBottle(bottle);
        const obstacle = world.obstacles.find((item) => bottle.isColliding(item));
        if (obstacle) return this.breakBottle(bottle);
        const enemy = world.enemies.find((item) => !item.isDead && bottle.isColliding(item));
        if (enemy) return this.hitEnemyWithBottle(bottle, enemy);
        if (!world.endboss.isDead && bottle.isColliding(world.endboss)) this.hitBossWithBottle(bottle);
    }

    /** Ein normaler Gegner stirbt nach einem Treffer. */
    hitEnemyWithBottle(bottle, enemy) {
        enemy.die();
        this.breakBottle(bottle);
        audioManager.playSound('bandit');
    }

    /** Verletzt den Boss und beendet das Level bei Sieg. */
    hitBossWithBottle(bottle) {
        const world = this.world;
        const defeated = world.endboss.hit(20);
        this.breakBottle(bottle);
        audioManager.playSound('bandit');
        GameUI.updateHUD(world);
        if (defeated) world.endGame(true);
    }

    /** Zerbricht die Flasche und erzeugt Funken. */
    breakBottle(bottle) {
        bottle.isRemoved = true;
        this.world.emitParticles(bottle.x, bottle.y, '#54ffe6');
    }
}
