class Obstacle extends MovableObject {
    /** Erstellt ein feststehendes Hindernis. */
    constructor(x, y, width, height) {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // Unsere eigene Kaktus-Grafik
        this.loadImage('img/obstacles/neon-cactus.svg');

        // Etwas kleinere Hitbox als die Grafik
        this.offsetLeft = 7;
        this.offsetRight = 7;
        this.offsetTop = 5;
        this.offsetBottom = 0;
    }
}
