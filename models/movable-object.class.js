class MovableObject {
    x = 120;
    y = 250;
    img;
    height = 150;
    width = 100;

    imageCache = {};
    currentImage = 0;
    speedY = 0;
    acceleration = 2.5;
    groundY = 270;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(paths) {
        paths.forEach((path) => {
            let image = new Image();
            image.src = path;
            this.imageCache[path] = image;
        });
    }

    playAnimation(images) {
        let index = this.currentImage % images.length;
        let path = images[index];

        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /** Bewegt das Objekt durch Schwerkraft. */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;

                if (this.y >= this.groundY) {
                    this.y = this.groundY;
                    this.speedY = 0;
                }
            }
        }, 1000 / 25);
    }

    /** Prüft, ob das Objekt in der Luft ist. */
    isAboveGround() {
        return this.y < this.groundY;
    }

    /** Startet den Sprung nach oben. */
    jump() {
        this.speedY = 30;
    }

    moveRight() {
        this.x += 5;
    }

    moveLeft() {
        this.x -= 5;
    }
}
