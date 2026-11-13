class BackgroundObject extends MovableObject {
    /**
     * Erstellt ein Hintergrundobjekt.
     * @param {string} imagePath - Bildpfad
     * @param {number} x - X-Position
     * @param {number} y - Y-Position
     */
    constructor(imagePath, x, y) {
        super();

        this.loadImage(imagePath);
        this.x = x;
        this.y = y;
        this.width = 720;
        this.height = 480;
    }
}
