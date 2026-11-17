/** Sammelbare Flasche. Wird ohne zusaetzliche Assets gezeichnet. */
class Bottle extends MovableObject {
    constructor(x, y = 365) {
        super();
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 58;
        this.offsetLeft = 4;
        this.offsetRight = 4;
    }

    /** Zeichnet eine deutliche orange-tuerkise Flasche. */
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = '#19dbe5';
        ctx.fillRect(10, 3, 10, 16);
        ctx.fillStyle = '#ffb52e';
        ctx.fillRect(4, 17, 22, 37);
        ctx.fillStyle = '#7b311d';
        ctx.fillRect(8, 0, 14, 6);
        ctx.fillStyle = '#fff4c8';
        ctx.fillRect(7, 29, 16, 9);
        ctx.restore();
    }
}
