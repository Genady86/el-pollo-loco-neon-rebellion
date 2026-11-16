class MovableObject {
    // ========================================
    // POSITION UND GROESSE
    // ========================================

    x = 120;
    y = 250;
    img;
    height = 150;
    width = 100;

    // ========================================
    // ANIMATION UND BEWEGUNG
    // ========================================

    imageCache = {};
    currentImage = 0;

    speedY = 0;
    acceleration = 2.5;
    groundY = 270;
    previousY = this.y;

    // ========================================
    // KOLLISIONSBEREICH
    // ========================================

    offsetTop = 0;
    offsetBottom = 0;
    offsetLeft = 0;
    offsetRight = 0;

    /** Laedt ein einzelnes Bild. */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /** Laedt mehrere Animationsbilder. */
    loadImages(paths) {
        paths.forEach((path) => {
            const image = new Image();
            image.src = path;
            this.imageCache[path] = image;
        });
    }

    /** Zeigt das naechste Animationsbild. */
    playAnimation(images) {
        const index = this.currentImage % images.length;
        const path = images[index];

        this.img = this.imageCache[path];
        this.currentImage++;
    }

    // ========================================
    // SCHWERKRAFT MIT PAUSE
    // ========================================

    /** Berechnet die vertikale Bewegung. */
    applyGravity() {
        setInterval(() => {
            // Bei Spielpause sofort abbrechen
            if (GameState.isPaused) return;

            if (this.isAboveGround() || this.speedY > 0) {
                // Vorherige Position merken
                this.previousY = this.y;

                // Figur vertikal bewegen
                this.y -= this.speedY;

                // Schwerkraft anwenden
                this.speedY -= this.acceleration;

                // Bodenbegrenzung
                if (this.y >= this.groundY) {
                    this.y = this.groundY;
                    this.speedY = 0;
                }
            }
        }, 1000 / 25);
    }

    /** Prueft, ob das Objekt ueber dem Boden ist. */
    isAboveGround() {
        return this.y < this.groundY;
    }

    /** Laesst das Objekt springen. */
    jump() {
        this.speedY = 30;
    }

    // ========================================
    // HORIZONTALE BEWEGUNG
    // ========================================

    moveRight() {
        this.x += 5;
    }

    moveLeft() {
        this.x -= 5;
    }

    // ========================================
    // KOLLISIONSERKENNUNG
    // ========================================

    /** Prueft die Kollision zweier Spielobjekte. */
    isColliding(other) {
        return (
            this.x + this.offsetLeft < other.x + other.width - other.offsetRight &&
            this.x + this.width - this.offsetRight > other.x + other.offsetLeft &&
            this.y + this.offsetTop < other.y + other.height - other.offsetBottom &&
            this.y + this.height - this.offsetBottom > other.y + other.offsetTop
        );
    }
}
