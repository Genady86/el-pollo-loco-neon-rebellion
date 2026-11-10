class Character extends MovableObject {
    // Animation: Laufen
    IMAGES_WALKING = [
        'img/player/player-run-01.png',
        'img/player/player-run-02.png',
        'img/player/player-run-03.png',
        'img/player/player-run-04.png',
        'img/player/player-run-05.png',
        'img/player/player-run-06.png',
    ];

    // Animation: Stehen
    IMAGES_IDLE = [
        'img/player/idle/pico-idle-01.png',
        'img/player/idle/pico-idle-02.png',
        'img/player/idle/pico-idle-03.png',
        'img/player/idle/pico-idle-04.png',
    ];

    // Animation: Springen
    IMAGES_JUMPING = [
        'img/player/jump/pico-jump-01.png',
        'img/player/jump/pico-jump-02.png',
        'img/player/jump/pico-jump-03.png',
    ];

    // Animation: Fallen
    IMAGES_FALLING = [
        'img/player/fall/pico-fall-01.png',
        'img/player/fall/pico-fall-02.png',
        'img/player/fall/pico-fall-03.png',
    ];

    // Zustand unserer Spielfigur
    isMoving = false;
    otherDirection = false;
    jumpKeyWasDown = false;

    /**
     * Erstellt unsere Spielfigur Pico.
     * @param {Keyboard} keyboard - Tastatursteuerung
     */
    constructor(keyboard) {
        super();

        this.keyboard = keyboard;
        this.y = 270;
        this.groundY = this.y;

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_FALLING);

        this.img = this.imageCache[this.IMAGES_WALKING[0]];

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

    /** Startet Bewegung und Bildanimation. */
    animate() {
        // Bewegung ungefähr 60-mal pro Sekunde prüfen
        setInterval(() => this.updateMovement(), 1000 / 60);

        // Alle 120 Millisekunden die passende Animation anzeigen
        setInterval(() => this.updateAnimation(), 120);
    }

    /** Prüft die gedrückten Tasten. */
    updateMovement() {
        this.checkJump();
        this.isMoving = false;

        if (this.keyboard.RIGHT && !this.keyboard.LEFT) {
            this.moveCharacterRight();
        }

        if (this.keyboard.LEFT && !this.keyboard.RIGHT) {
            this.moveCharacterLeft();
        }
    }

    /** Bewegt Pico nach rechts. */
    moveCharacterRight() {
        if (this.x >= 720 - this.width) return;

        this.moveRight();
        this.otherDirection = false;
        this.x = Math.min(this.x, 720 - this.width);
        this.isMoving = true;
    }

    /** Bewegt Pico nach links. */
    moveCharacterLeft() {
        if (this.x <= 0) return;

        this.moveLeft();
        this.otherDirection = true;
        this.x = Math.max(this.x, 0);
        this.isMoving = true;
    }

    /** Wählt die passende Animation für Pico. */
    updateAnimation() {
        if (this.isAboveGround() && this.speedY > 0) {
            this.playAnimation(this.IMAGES_JUMPING);
        } else if (this.isAboveGround()) {
            this.playAnimation(this.IMAGES_FALLING);
        } else if (this.isMoving) {
            this.playAnimation(this.IMAGES_WALKING);
        } else {
            this.playAnimation(this.IMAGES_IDLE);
        }
    }
}
