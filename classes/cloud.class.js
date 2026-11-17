/** Parallax-Wolke, die bei Pausen nicht weiterfliegt. */
class Cloud extends MovableObject {
    constructor(x, y, speed = 0.15, scale = 1) {
        super();
        this.loadImage('img/clouds/fiesta-cloud.svg');
        this.x = x;
        this.y = y;
        this.width = 180 * scale;
        this.height = 85 * scale;
        this.speed = speed * 60;
    }

    /** Verschiebt die Wolke zeitbasiert in der Welt. */
    update(dt, levelWidth) {
        this.x -= this.speed * dt;
        if (this.x + this.width < 0) this.x = levelWidth;
    }
}
