/** Geworfene Flasche mit waagerechter Bewegung und Gravitation. */
class ThrowableObject extends MovableObject {
    constructor(x, y, direction) {
        super();
        this.x = x;
        this.y = y;
        this.width = 25;
        this.height = 35;
        this.speedX = direction * 420;
        this.speedY = 340;
    }

    /** Aktualisiert die Wurfparabel. */
    update(dt) {
        this.x += this.speedX * dt;
        this.y -= this.speedY * dt;
        this.speedY -= 850 * dt;
    }

    /** Visualisiert die Flugflasche. */
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = '#2de5d8';
        ctx.shadowColor = '#46e8ff';
        ctx.shadowBlur = 13;
        ctx.fillRect(this.x + 6, this.y, 13, 7);
        ctx.fillStyle = '#ffbd45';
        ctx.fillRect(this.x, this.y + 7, 25, 28);
        ctx.restore();
    }
}
