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
    previousY = this.y;
    offsetTop = 0;
    offsetBottom = 0;
    offsetLeft = 0;
    offsetRight = 0;

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
                // Position vor der Bewegung merken
                this.previousY = this.y;
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

    /** Prüft die Kollision mit angepassten Hitboxen. */
    isColliding(other) {
        return (
            this.x + this.offsetLeft < other.x + other.width - other.offsetRight &&
            this.x + this.width - this.offsetRight > other.x + other.offsetLeft &&
            this.y + this.offsetTop < other.y + other.height - other.offsetBottom &&
            this.y + this.height - this.offsetBottom > other.y + other.offsetTop
        );
    }
}
