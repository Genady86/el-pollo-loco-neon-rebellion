/** Hindernis mit sichtbaren und physikalischen Abmessungen. */
class Obstacle extends MovableObject {
    constructor(x, y, width, height) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.offsetLeft = 7;
        this.offsetRight = 7;
        this.offsetTop = 5;
        this.loadImage('img/obstacles/neon-cactus.svg');
    }
}
