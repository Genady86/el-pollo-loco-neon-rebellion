/** Pollo Bandido: normaler Patrouillen-Gegner. */
class Chicken extends MovableObject {
    IMAGES_DEATH = [
        'img/enemies/pollo-bandido/death/pollo-bandido-death-01-hit-react.png',
        'img/enemies/pollo-bandido/death/pollo-bandido-death-02-dazed.png',
        'img/enemies/pollo-bandido/death/pollo-bandido-death-03-backflip.png',
        'img/enemies/pollo-bandido/death/pollo-bandido-death-04-defeated.png',
    ];

    constructor(x = 480) {
        super();
        this.loadImage('img/enemies/pollo-bandido-idle-01.png');
        this.loadImages(this.IMAGES_DEATH);
        this.x = x;
        this.y = 290;
        this.startX = x;
        this.speed = 55;
        this.direction = -1;
        this.isDead = false;
        this.deadAt = 0;
        this.offsetLeft = 20;
        this.offsetRight = 20;
        this.offsetTop = 25;
        this.offsetBottom = 15;
    }

    /** Patrouilliert, solange der Gegner lebt. */
    update(dt) {
        if (this.isDead) return this.updateDeathAnimation();
        if (this.x < this.startX - 55) this.direction = 1;
        if (this.x > this.startX + 55) this.direction = -1;
        this.x += this.direction * this.speed * dt;
        this.otherDirection = this.direction > 0;
    }

    /** Startet nach einem erfolgreichen Sprung oder Flaschenwurf. */
    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.deadAt = GameState.now();
        this.currentImage = 0;
    }

    /** Original-Death-Frames aus dem vorhandenen Spriteordner. */
    updateDeathAnimation() {
        const elapsed = GameState.now() - this.deadAt;
        const index = Math.min(3, Math.floor(elapsed / 180));
        this.img = this.imageCache[this.IMAGES_DEATH[index]];
        if (elapsed > 1150) this.isRemoved = true;
    }
}
