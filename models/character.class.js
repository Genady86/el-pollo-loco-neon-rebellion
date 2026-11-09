class Character extends MovableObject {
    IMAGES_WALKING = [
        'img/player/player-run-01.png',
        'img/player/player-run-02.png',
        'img/player/player-run-03.png',
        'img/player/player-run-04.png',
        'img/player/player-run-05.png',
        'img/player/player-run-06.png',
    ];

    isMoving = false;
    otherDirection = false;
    jumpKeyWasDown = false;

    constructor(keyboard) {
        super();

        this.keyboard = keyboard;
        this.y = 270;

        this.loadImages(this.IMAGES_WALKING);
        this.img = this.imageCache[this.IMAGES_WALKING[0]];

        this.groundY = this.y;
        this.applyGravity();
        this.animate();
    }

    /** Prüft, ob Pico springen darf. */
    checkJump() {
        if (this.keyboard.SPACE && !this.jumpKeyWasDown && !this.isAboveGround()) {
            this.jump();
        }

        this.jumpKeyWasDown = this.keyboard.SPACE;
    }

    animate() {
        // Bewegung ungefähr 60-mal pro Sekunde prüfen
        setInterval(() => {
            this.checkJump();

            this.isMoving = false;

            // Nach rechts laufen
            if (this.keyboard.RIGHT && !this.keyboard.LEFT) {
                if (this.x < 720 - this.width) {
                    this.moveRight();
                    this.otherDirection = false;
                    this.x = Math.min(this.x, 720 - this.width);
                    this.isMoving = true;
                }
            }

            // Nach links laufen
            if (this.keyboard.LEFT && !this.keyboard.RIGHT) {
                if (this.x > 0) {
                    this.moveLeft();
                    this.otherDirection = true;
                    this.x = Math.max(this.x, 0);
                    this.isMoving = true;
                }
            }
        }, 1000 / 60);

        // Laufanimation nur während der Bewegung
        setInterval(() => {
            if (this.isMoving) {
                this.playAnimation(this.IMAGES_WALKING);
            } else {
                this.img = this.imageCache[this.IMAGES_WALKING[0]];
                this.currentImage = 0;
            }
        }, 120);
    }
}
