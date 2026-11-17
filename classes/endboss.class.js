/** Endboss: Kontakt-Angriff und Schaden ausschliesslich durch Flaschen. */
class Endboss extends MovableObject {
    constructor(x = 2130) {
        super();
        this.setupBossPosition(x);
        this.setupBossState();
        this.setupBossHitbox();
        this.loadImage('img/enemies/pollo-bandido-idle-01.png');
    }

    /** Startposition und Bossgroesse. */
    setupBossPosition(x) {
        this.x = x;
        this.y = 235;
        this.width = 175;
        this.height = 205;
    }

    /** Hitpoints und visueller Unterscheid zum normalen Chicken. */
    setupBossState() {
        this.energy = 100;
        this.isDead = false;
        this.deadAt = 0;
        this.lastHitAt = 0;
        this.visualFilter = 'hue-rotate(235deg) saturate(1.6)';
    }

    /** Boss-Hitbox ist enger als sein sichtbarer Sprite. */
    setupBossHitbox() {
        this.offsetLeft = 30;
        this.offsetRight = 30;
        this.offsetTop = 20;
        this.offsetBottom = 10;
    }

    /** Verfolgt Pico nur, sobald er in die Boss-Arena kommt. */
    update(dt, characterX) {
        if (this.isDead) return;
        const difference = characterX - this.x;
        if (Math.abs(difference) > 440 || Math.abs(difference) < 95) return;
        this.x += Math.sign(difference) * 42 * dt;
        this.otherDirection = difference > 0;
    }

    /** Boss verliert Hitpoints statt bei einem Treffer zu sterben. */
    hit(damage = 20) {
        if (this.isDead) return false;
        this.energy = Math.max(0, this.energy - damage);
        this.lastHitAt = GameState.now();
        if (this.energy === 0) {
            this.isDead = true;
            this.deadAt = GameState.now();
        }
        return this.isDead;
    }

    /** Vorhandenes Boss-Sprite mit Treffer- und Todesanimation zeichnen. */
    draw(ctx) {
        if (!this.img || !this.img.complete || !this.img.naturalWidth) return;
        ctx.save();
        if (this.isDead) this.applyDeathEffect(ctx);
        else this.applyBossEffect(ctx);
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
        ctx.restore();
    }

    /** Normale Bossbewegung mit sanftem Puls und Trefferwackeln. */
    applyBossEffect(ctx) {
        const shaking = GameState.now() - this.lastHitAt < 240;
        ctx.translate(this.x + (shaking ? Math.sin(GameState.now() / 12) * 6 : 0), this.y);
        ctx.filter = shaking ? 'brightness(1.9) sepia(1)' : this.visualFilter;
        ctx.globalAlpha = .97 + Math.sin(performance.now() / 220) * .03;
    }

    /** Bei Sieg faellt der Boss zur Seite und verblasst. */
    applyDeathEffect(ctx) {
        const elapsed = Math.max(0, GameState.now() - this.deadAt);
        const angle = Math.min(Math.PI / 2, elapsed / 650 * Math.PI / 2);
        ctx.translate(this.x + this.width / 2, this.y + this.height);
        ctx.rotate(angle);
        ctx.translate(-this.width / 2, -this.height);
        ctx.globalAlpha = Math.max(.18, 1 - elapsed / 1600);
        ctx.filter = 'grayscale(1)';
    }
}
