/** Kleiner optionaler Effekt ohne Auswirkung auf die Treffermechanik. */
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.speedX = (Math.random() - .5) * 220;
        this.speedY = (Math.random() - .5) * 220;
        this.opacity = 1;
    }

    /** Bewegt die Partikel zeitabhaengig. */
    update(dt) {
        this.x += this.speedX * dt;
        this.y += this.speedY * dt;
        this.opacity = Math.max(0, this.opacity - dt * 2);
    }

    /** Malt einen sanft ausblendenden Funken. */
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 4, 4);
        ctx.restore();
    }
}
