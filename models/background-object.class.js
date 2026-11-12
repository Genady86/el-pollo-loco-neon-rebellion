class BackgroundObject extends MovableObject {
    /**
     * Erstellt ein Hintergrundobjekt.
     * @param {string} imagePath - Pfad zum Bild
     */
    constructor(imagePath) {
        super();

        this.loadImage(imagePath);
        this.x = 0;
        this.y = 0;
        this.width = 720;
        this.height = 480;
    }
}
