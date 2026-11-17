/** Hier laufen die Teile des Spiels zusammen. */
class World {
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.level = createLevel1();
        this.setup = new WorldSetup(this);
        this.setup.loadLevel();
        this.setup.createCharacter();
        this.setup.createStatusBars();
        this.collisionManager = new CollisionManager(this);
        this.projectileManager = new ProjectileManager(this);
        this.particleManager = new ParticleManager(this);
        this.renderer = new WorldRenderer(this);
        this.setup.prepareGame();
    }

    /** Stoppt die alte Spielrunde. */
    dispose() {
        this.disposed = true;
        cancelAnimationFrame(this.frameId);
    }

    /** Zeichnet das Spiel immer wieder neu. */
    draw(now) {
        if (this.disposed) return;
        const dt = this.lastFrameAt ? Math.min((now - this.lastFrameAt) / 1000, .05) : 0;
        this.lastFrameAt = now;
        if (!GameState.isPaused && !this.ended) this.update(dt);
        this.updateCamera();
        this.renderer.draw();
        this.frameId = requestAnimationFrame((time) => this.draw(time));
    }

    /** Aktualisiert Pico, Gegner und die Spielwelt. */
    update(dt) {
        this.character.update(dt);
        this.enemies.forEach((enemy) => enemy.update(dt));
        this.endboss.update(dt, this.character.x);
        this.clouds.forEach((cloud) => cloud.update(dt, this.levelWidth));
        this.checkCollisions();
        this.checkThrowInput();
        this.updateProjectiles(dt);
        this.updateParticles(dt);
        this.updateLanding();
        this.updateBars();
    }

    /** Die Kamera folgt Pico durch das Level. */
    updateCamera() {
        const center = this.character.x + this.character.width / 2 - this.canvas.width / 2;
        this.cameraX = Math.max(0, Math.min(center, this.levelWidth - this.canvas.width));
    }

    /** Lässt die Zusammenstöße prüfen. */
    checkCollisions() {
        this.collisionManager.checkCollisions();
    }

    /** Lässt eingesammelte Münzen prüfen. */
    collectCoins() {
        this.collisionManager.collectCoins();
    }

    /** Lässt eingesammelte Flaschen prüfen. */
    collectBottles() {
        this.collisionManager.collectBottles();
    }

    /** Prüft den Kontakt mit einem Gegner. */
    checkEnemyCollision(enemy) {
        this.collisionManager.checkEnemyCollision(enemy);
    }

    /** Prüft den Kontakt mit dem Endboss. */
    checkBossCollision() {
        this.collisionManager.checkBossCollision();
    }

    /** Prüft, ob Pico einen Gegner von oben trifft. */
    reportCollision(enemy) {
        this.collisionManager.reportCollision(enemy);
    }

    /** Zieht Pico bei einem Treffer Leben ab. */
    damageCharacter(amount) {
        this.collisionManager.damageCharacter(amount);
    }

    /** Prüft, ob Pico die Schmiede benutzen darf. */
    interactWithForge() {
        if (!this.forge || this.ended) return;
        const center = this.character.x + this.character.width / 2;
        const forgeCenter = this.forge.x + this.forge.width / 2;
        if (Math.abs(center - forgeCenter) > 150) {
            return GameUI.setForgeStatus('⚒️ Pico ist zu weit von der Schmiede entfernt.');
        }
        if (this.collectedCoins - this.coinsSpent < this.forge.price) {
            return GameUI.setForgeStatus('⚒️ Sammle erst 3 Münzen für die Schmiede.');
        }
        GameUI.setForgeStatus('⚒️ Schmiede erreicht! Die Revolver bleiben ein späteres Extra.');
    }

    /** Prüft, ob Pico eine Flasche werfen will. */
    checkThrowInput() { this.projectileManager.checkThrowInput(); }

    /** Wirft eine Flasche. */
    throwBottle() { this.projectileManager.throwBottle(); }

    /** Bewegt alle geworfenen Flaschen. */
    updateProjectiles(dt) { this.projectileManager.updateProjectiles(dt); }

    /** Prüft, ob eine Flasche etwas trifft. */
    checkProjectileHit(bottle) { this.projectileManager.checkProjectileHit(bottle); }

    /** Trifft einen Gegner mit einer Flasche. */
    hitEnemyWithBottle(bottle, enemy) { this.projectileManager.hitEnemyWithBottle(bottle, enemy); }

    /** Trifft den Endboss mit einer Flasche. */
    hitBossWithBottle(bottle) { this.projectileManager.hitBossWithBottle(bottle); }

    /** Lässt eine Flasche zerbrechen. */
    breakBottle(bottle) { this.projectileManager.breakBottle(bottle); }

    /** Zeigt kleine Effekte an. */
    emitParticles(x, y, color) { this.particleManager.emitParticles(x, y, color); }

    /** Bewegt die kleinen Effekte. */
    updateParticles(dt) { this.particleManager.updateParticles(dt); }

    /** Zeigt einen Effekt beim Landen. */
    updateLanding() { this.particleManager.updateLanding(); }

    /** Aktualisiert die Balken für Leben und Flaschen. */
    updateBars() {
        this.playerBar.setPercentage(this.energy);
        this.bottleBar.setPercentage(this.bottleCount * 20);
        this.bossBar.setPercentage(this.endboss.energy);
    }

    /** Zeigt den Boss-Balken erst in seiner Nähe. */
    isBossVisible() {
        return !this.endboss.isDead && this.character.x > this.endboss.x - 680;
    }

    /** Beendet das Spiel bei Sieg oder Niederlage. */
    endGame(victory) {
        if (this.ended) return;
        this.ended = true;
        if (!victory) this.character.die();
        audioManager.updatePlayback(true);
        GameUI.showResult(victory);
    }
}
