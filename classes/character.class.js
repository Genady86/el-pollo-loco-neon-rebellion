/** Pico kann laufen, springen und Schaden bekommen. */
class Character extends MovableObject {
    constructor(keyboard) {
        super();
        this.keyboard = keyboard;
        this.setup = new CharacterSetup(this);
        this.setup.setupPosition();
        this.setup.setupState();
        this.setup.setupHitbox();
        this.animation = new CharacterAnimation(this);
        this.animation.loadAllImages();
    }

    /** Bewegt Pico und zeigt das passende Bild. */
    update(dt) {
        if (this.isDead) return;
        this.checkJump();
        this.updateMovement(dt);
        this.applyGravity(dt);
        this.updateAnimation();
    }

    /** Pico springt nur, wenn er auf dem Boden steht. */
    checkJump() {
        if (this.keyboard.SPACE && !this.jumpKeyWasDown && !this.isAboveGround()) {
            this.jump();
            audioManager.playSound('jump');
        }
        this.jumpKeyWasDown = this.keyboard.SPACE;
    }

    /** Gibt Pico Schwung nach oben. */
    jump() {
        this.speedY = 640;
    }

    /** Zieht Pico nach dem Sprung wieder nach unten. */
    applyGravity(dt) {
        this.previousY = this.y;
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY * dt;
            this.speedY -= this.acceleration * dt;
        }
        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.speedY = 0;
        }
    }

    /** Prüft, ob Pico in der Luft ist. */
    isAboveGround() {
        return this.y < this.groundY;
    }

    /** Bewegt Pico nach links oder rechts. */
    updateMovement(dt) {
        const direction = Number(this.keyboard.RIGHT) - Number(this.keyboard.LEFT);
        this.isMoving = direction !== 0;
        if (this.isMoving) this.moveCharacter(direction * 300 * dt);
        if (this.isMoving || this.keyboard.SPACE || this.isAboveGround()) this.resetIdleState();
    }

    /** Verhindert, dass Pico durch Hindernisse läuft. */
    moveCharacter(step) {
        const nextX = Math.max(0, Math.min(this.levelWidth - this.width, this.x + step));
        this.otherDirection = step < 0;
        if (this.canMoveTo(nextX)) this.x = nextX;
    }

    /** Prüft, ob der nächste Schritt möglich ist. */
    canMoveTo(nextX) {
        const oldX = this.x;
        this.x = nextX;
        const blocked = this.obstacles.some((obstacle) => {
            const newOverlap = this.horizontalOverlap(obstacle);
            this.x = oldX;
            const oldOverlap = this.horizontalOverlap(obstacle);
            this.x = nextX;
            return this.isColliding(obstacle) && newOverlap > oldOverlap;
        });
        this.x = oldX;
        return !blocked;
    }

    /** Misst, wie stark zwei Figuren sich berühren. */
    horizontalOverlap(obstacle) {
        const mine = this.hitbox();
        const other = obstacle.hitbox();
        return Math.max(0, Math.min(mine.right, other.right) - Math.max(mine.left, other.left));
    }

    /** Prüft, ob Pico auf einen Gegner springt. */
    isStomping(enemy) {
        const top = enemy.y + enemy.offsetTop;
        const before = this.previousY + this.height - this.offsetBottom;
        const now = this.y + this.height - this.offsetBottom;
        return this.speedY < 0 && before <= top && now >= top && this.isColliding(enemy);
    }

    /** Merkt sich, wann Pico getroffen wurde. */
    hit() {
        this.hurtUntil = GameState.now() + 850;
        this.resetIdleState();
    }

    /** Prüft, ob Pico gerade verletzt ist. */
    isHurt() {
        return GameState.now() < this.hurtUntil;
    }

    /** Stoppt Pico, wenn er keine Leben mehr hat. */
    die() {
        this.isDead = true;
        this.speedY = 0;
        this.isSleeping = false;
        this.currentAnimation = 'death';
    }

    /** Zeigt das passende Bild für Picos Bewegung. */
    updateAnimation() {
        this.animation.updateAnimation();
    }

    /** Startet die Wartezeit neu, wenn Pico sich bewegt. */
    resetIdleState() {
        this.animation.resetIdleState();
    }
}
