/** Leinwand-Statusbar fuer Energie, Flaschen und Endboss. */
class StatusBar {
    constructor(x, y, width, color, label) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.color = color;
        this.label = label;
        this.percentage = 100;
    }

    /** Begrenzt den Prozentwert sicher auf 0 bis 100. */
    setPercentage(value) {
        this.percentage = Math.max(0, Math.min(100, value));
    }

    /** Zeichnet die Statusbar ohne SVG-/PNG-Abhaengigkeit. */
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = '#130e27';
        ctx.fillRect(this.x, this.y, this.width, 18);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + 3, this.y + 3, (this.width - 6) * this.percentage / 100, 12);
        ctx.strokeStyle = '#fff7de';
        ctx.strokeRect(this.x, this.y, this.width, 18);
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.fillText(this.label, this.x, this.y - 5);
        ctx.restore();
    }
}
