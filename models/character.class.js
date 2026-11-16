class Character extends MovableObject {
    // ========================================
    // ANIMATIONSBILDER
    // ========================================

    IMAGES_WALKING = [
        'img/player/player-run-01.png',
        'img/player/player-run-02.png',
        'img/player/player-run-03.png',
        'img/player/player-run-04.png',
        'img/player/player-run-05.png',
        'img/player/player-run-06.png',
    ];

    IMAGES_IDLE = [
        'img/player/idle-premium/pico-idle-premium-01.png',
        'img/player/idle-premium/pico-idle-premium-02.png',
        'img/player/idle-premium/pico-idle-premium-03.png',
        'img/player/idle-premium/pico-idle-premium-04.png',
        'img/player/idle-premium/pico-idle-premium-05.png',
        'img/player/idle-premium/pico-idle-premium-06.png',
        'img/player/idle-premium/pico-idle-premium-07.png',
    ];

    IMAGES_DANCE = [
        'img/player/dance/pico-idle-funny-01.png',
        'img/player/dance/pico-idle-funny-02.png',
        'img/player/dance/pico-idle-funny-03.png',
        'img/player/dance/pico-idle-funny-04.png',
        'img/player/dance/pico-idle-funny-05.png',
        'img/player/dance/pico-idle-funny-06.png',
    ];

    IMAGES_JUMPING = [
        'img/player/jump/pico-jump-01.png',
        'img/player/jump/pico-jump-02.png',
        'img/player/jump/pico-jump-03.png',
    ];

    IMAGES_FALLING = [
        'img/player/fall/pico-fall-01.png',
        'img/player/fall/pico-fall-02.png',
        'img/player/fall/pico-fall-03.png',
    ];

    // ========================================
    // BEWEGUNGSZUSTAND
    // ========================================

    isMoving = false;
    otherDirection = false;
    jumpKeyWasDown = false;

    // ========================================
    // TANZ UND IDLE
    // ========================================

    isDancing = false;
    dancePlayed = false;
    idleSince = GameState.now();
    danceSince = 0;
    currentAnimation = '';

    DANCE_DELAY = 10000;
    IDLE_FRAME_MS = 210;
    DANCE_FRAME_MS = 550;

    // ========================================
    // HINDERNISSE
    // ========================================

    obstacles = [];

    // ========================================
    // KONSTRUKTOR
    // ========================================

    constructor(keyboard) {
        super();

        this.keyboard = keyboard;

        this.y = 290;
        this.groundY = this.y;

        // Bestehende Hitbox beibehalten
        this.offsetLeft = 25;
        this.offsetRight = 25;
        this.offsetTop = 20;
        this.offsetBottom = 15;

        // Animationsbilder vorladen
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_DANCE);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_FALLING);

        this.img = this.imageCache[this.IMAGES_IDLE[0]];

        // Spielmechanik starten
        this.applyGravity();
        this.animate();
    }

    // ========================================
    // SPRINGEN
    // ========================================

    /** Springt nur bei einem neuen Tastendruck. */
    checkJump() {
        if (this.keyboard.SPACE && !this.jumpKeyWasDown && !this.isAboveGround()) {
            this.jump();

            // Sprungsound
            audioManager.playSound('jump');
        }

        this.jumpKeyWasDown = this.keyboard.SPACE;
    }

    // ========================================
    // GEGNERKOLLISION
    // ========================================

    /** Erkennt das Besiegen eines Gegners von oben. */
    isStomping(enemy) {
        const enemyTop = enemy.y + enemy.offsetTop;

        const previousBottom = this.previousY + this.height - this.offsetBottom;

        const currentBottom = this.y + this.height - this.offsetBottom;

        return (
            this.speedY < 0 &&
            previousBottom <= enemyTop &&
            currentBottom > enemyTop &&
            this.isColliding(enemy)
        );
    }

    // ========================================
    // ANIMATION STARTEN
    // ========================================

    animate() {
        setInterval(() => {
            if (GameState.isPaused) return;

            this.updateMovement();
        }, 1000 / 60);

        setInterval(() => {
            if (GameState.isPaused) return;

            this.updateAnimation();
        }, 120);
    }

    // ========================================
    // TASTATUREINGABEN
    // ========================================

    updateMovement() {
        this.checkJump();

        this.isMoving = false;

        if (this.keyboard.RIGHT && !this.keyboard.LEFT) {
            this.moveCharacterRight();
        }

        if (this.keyboard.LEFT && !this.keyboard.RIGHT) {
            this.moveCharacterLeft();
        }

        if (
            this.isMoving ||
            this.keyboard.LEFT ||
            this.keyboard.RIGHT ||
            this.keyboard.SPACE ||
            this.isAboveGround()
        ) {
            this.resetIdleState();
        }
    }

    // ========================================
    // HINDERNISKOLLISION
    // ========================================

    /** Prueft, ob Pico an eine geplante Position darf. */
    canMoveTo(nextX) {
        const oldX = this.x;

        // Geplante Position voruebergehend einsetzen
        this.x = nextX;

        const blocked = this.obstacles.some((obstacle) => {
            // Keine Beruehrung: Bewegung ist erlaubt
            if (!this.isColliding(obstacle)) {
                return false;
            }

            // Tatsächliche horizontale Trefferflaechen
            const obstacleLeft = obstacle.x + obstacle.offsetLeft;

            const obstacleRight = obstacle.x + obstacle.width - obstacle.offsetRight;

            const oldLeft = oldX + this.offsetLeft;
            const oldRight = oldX + this.width - this.offsetRight;

            const newLeft = nextX + this.offsetLeft;
            const newRight = nextX + this.width - this.offsetRight;

            // Ueberlappung vor der Bewegung
            const oldOverlap = Math.max(
                0,
                Math.min(oldRight, obstacleRight) - Math.max(oldLeft, obstacleLeft),
            );

            // Ueberlappung nach der Bewegung
            const newOverlap = Math.max(
                0,
                Math.min(newRight, obstacleRight) - Math.max(newLeft, obstacleLeft),
            );

            // Pico darf nicht tiefer in ein Hindernis laufen.
            // Eine Bewegung aus einem Hindernis heraus
            // bleibt dagegen moeglich.
            return newOverlap > oldOverlap;
        });

        // Urspruengliche Position wiederherstellen
        this.x = oldX;

        return !blocked;
    }

    // ========================================
    // NACH RECHTS LAUFEN
    // ========================================

    moveCharacterRight() {
        const rightBoundary = this.levelWidth - this.width;

        if (this.x >= rightBoundary) return;

        const nextX = Math.min(this.x + 5, rightBoundary);

        this.otherDirection = false;

        // Kaktus oder anderes Hindernis im Weg?
        if (!this.canMoveTo(nextX)) {
            return;
        }

        this.moveRight();
        this.x = nextX;
        this.isMoving = true;
    }

    // ========================================
    // NACH LINKS LAUFEN
    // ========================================

    moveCharacterLeft() {
        if (this.x <= 0) return;

        const nextX = Math.max(this.x - 5, 0);

        this.otherDirection = true;

        // Kaktus oder anderes Hindernis im Weg?
        if (!this.canMoveTo(nextX)) {
            return;
        }

        this.moveLeft();
        this.x = nextX;
        this.isMoving = true;
    }

    // ========================================
    // ANIMATION AUSWAEHLEN
    // ========================================

    updateAnimation() {
        if (this.isAboveGround() && this.speedY > 0) {
            this.showMovingAnimation('jump', this.IMAGES_JUMPING);
        } else if (this.isAboveGround()) {
            this.showMovingAnimation('fall', this.IMAGES_FALLING);
        } else if (this.isMoving) {
            this.showMovingAnimation('walk', this.IMAGES_WALKING);
        } else {
            this.updateIdleAnimation();
        }
    }

    // ========================================
    // BEWEGUNGSANIMATION
    // ========================================

    showMovingAnimation(state, images) {
        if (this.currentAnimation !== state) {
            this.currentAnimation = state;
            this.currentImage = 0;
        }

        this.playAnimation(images);
    }

    // ========================================
    // IDLE ZURUECKSETZEN
    // ========================================

    resetIdleState() {
        this.idleSince = GameState.now();
        this.isDancing = false;
        this.dancePlayed = false;
        this.danceSince = 0;
        this.currentAnimation = '';
    }

    // ========================================
    // IDLE UND TANZ
    // ========================================

    updateIdleAnimation() {
        const now = GameState.now();

        if (!this.dancePlayed && now - this.idleSince >= this.DANCE_DELAY) {
            this.startDance(now);
        }

        if (this.isDancing) {
            this.playDanceFrame(now);
        } else {
            this.playIdleFrame(now);
        }
    }

    // ========================================
    // IDLE-ANIMATION
    // ========================================

    playIdleFrame(now) {
        this.currentAnimation = 'idle';

        const index = Math.floor((now - this.idleSince) / this.IDLE_FRAME_MS);

        const path = this.IMAGES_IDLE[index % this.IMAGES_IDLE.length];

        this.img = this.imageCache[path];
    }

    // ========================================
    // TANZ STARTEN
    // ========================================

    startDance(now) {
        this.isDancing = true;
        this.dancePlayed = true;
        this.danceSince = now;
        this.currentAnimation = 'dance';
    }

    // ========================================
    // TANZ ABSPIELEN
    // ========================================

    playDanceFrame(now) {
        const index = Math.floor((now - this.danceSince) / this.DANCE_FRAME_MS);

        if (index >= this.IMAGES_DANCE.length) {
            this.isDancing = false;
            this.idleSince = now;
            this.playIdleFrame(now);
            return;
        }

        this.img = this.imageCache[this.IMAGES_DANCE[index]];
    }
}
