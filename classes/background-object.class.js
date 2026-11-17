/** Eine einzelne Hintergrund-Kachel. */
class BackgroundObject extends MovableObject {
    constructor(path, x, y = 0) {
        super();
        this.loadImage(path);
        this.x = x;
        this.y = y;
        this.width = 720;
        this.height = 480;
    }
}
