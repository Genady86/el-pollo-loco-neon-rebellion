class Character extends MovableObject {
    // Bereits vorhandene Lauf-, Sprung- und Fallanimationen
    IMAGES_WALKING = [
        'img/player/player-run-01.png',
        'img/player/player-run-02.png',
        'img/player/player-run-03.png',
        'img/player/player-run-04.png',
        'img/player/player-run-05.png',
        'img/player/player-run-06.png',
    ];

    // Sieben neue Standbilder aus der Premium-Grafikdemo
    IMAGES_IDLE = [
        'img/player/idle-premium/pico-idle-premium-01.png',
        'img/player/idle-premium/pico-idle-premium-02.png',
        'img/player/idle-premium/pico-idle-premium-03.png',
        'img/player/idle-premium/pico-idle-premium-04.png',
        'img/player/idle-premium/pico-idle-premium-05.png',
        'img/player/idle-premium/pico-idle-premium-06.png',
        'img/player/idle-premium/pico-idle-premium-07.png',
    ];

    // Sechs Bilder fuer den einmaligen Sombrero-Tanz
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

    // Bewegungs- und Animationszustand
    isMoving = false;
    otherDirection = false;
    jumpKeyWasDown = false;
    isDancing = false;
    dancePlayed = false;
    idleSince = Date.now();
    danceSince = 0;
    currentAnimation = '';

    // Zeitangaben in Millisekunden
    DANCE_DELAY = 10000;
    IDLE_FRAME_MS = 210;
    DANCE_FRAME_MS = 550;

    /** Erstellt Pico. @param {Keyboard} keyboard Tastatursteuerung */
    constructor(keyboard) {
        super();
        this.keyboard = keyboard;
        this.y = 290;
        this.groundY = this.y;

        // Unveraenderte Hitbox
        this.offsetLeft = 25;
        this.offsetRight = 25;
        this.offsetTop = 20;
        this.offsetBottom = 15;

        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_DANCE);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_FALLING);
        this.img = this.imageCache[this.IMAGES_IDLE[0]];

        this.applyGravity();
        this.animate();
    }

    /** Springen nur bei neuem Tastendruck erlauben. */
    checkJump() {
        if (this.keyboard.SPACE && !this.jumpKeyWasDown && !this.isAboveGround()) {
            this.jump();
        }
        this.jumpKeyWasDown = this.keyboard.SPACE;
    }

    /** Prueft einen Treffer von oben auf einen Gegner. */
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

    /** Startet Bewegung und Animation. */
    animate() {
        setInterval(() => this.updateMovement(), 1000 / 60);
        setInterval(() => this.updateAnimation(), 120);
    }

    /** Prueft Tastatur, Bewegung und Unterbrechungen. */
    updateMovement() {
        this.checkJump();
        this.isMoving = false;
        if (this.keyboard.RIGHT && !this.keyboard.LEFT) this.moveCharacterRight();
        if (this.keyboard.LEFT && !this.keyboard.RIGHT) this.moveCharacterLeft();

        // Auch ein Tastendruck am Levelrand bricht den Tanz ab
        if (this.isMoving || this.keyboard.LEFT || this.keyboard.RIGHT ||
            this.keyboard.SPACE || this.isAboveGround()) {
            this.resetIdleState();
        }
    }

    /** Bewegt Pico nach rechts, ohne das Level zu verlassen. */
    moveCharacterRight() {
        const rightBoundary = this.levelWidth - this.width;
        if (this.x >= rightBoundary) return;
        this.moveRight();
        this.otherDirection = false;
        this.x = Math.min(this.x, rightBoundary);
        this.isMoving = true;
    }

    /** Bewegt Pico nach links, ohne das Level zu verlassen. */
    moveCharacterLeft() {
        if (this.x <= 0) return;
        this.moveLeft();
        this.otherDirection = true;
        this.x = Math.max(this.x, 0);
        this.isMoving = true;
    }

    /** Waehlt Springen, Fallen, Laufen oder Stehen. */
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

    /** Verhindert zufaellige Frame-Spruenge beim Zustandswechsel. */
    showMovingAnimation(state, images) {
        if (this.currentAnimation !== state) {
            this.currentAnimation = state;
            this.currentImage = 0;
        }
        this.playAnimation(images);
    }

    /** Beendet den Tanz sofort bei einer Eingabe. */
    resetIdleState() {
        this.idleSince = Date.now();
        this.isDancing = false;
        this.dancePlayed = false;
        this.danceSince = 0;
        this.currentAnimation = '';
    }

    /** Spielt ruhiges Stehen und startet einmalig den Tanz. */
    updateIdleAnimation() {
        const now = Date.now();
        if (!this.dancePlayed && now - this.idleSince >= this.DANCE_DELAY) {
            this.startDance(now);
        }
        if (this.isDancing) {
            this.playDanceFrame(now);
        } else {
            this.playIdleFrame(now);
        }
    }

    /** Zeigt die sieben Standbilder mit gleichmaessigem Tempo. */
    playIdleFrame(now) {
        this.currentAnimation = 'idle';
        const index = Math.floor((now - this.idleSince) / this.IDLE_FRAME_MS);
        const path = this.IMAGES_IDLE[index % this.IMAGES_IDLE.length];
        this.img = this.imageCache[path];
    }

    /** Merkt sich den genauen Startzeitpunkt des Tanzes. */
    startDance(now) {
        this.isDancing = true;
        this.dancePlayed = true;
        this.danceSince = now;
        this.currentAnimation = 'dance';
    }

    /** Spielt sechs Tanzframes einmal ab, ohne ein Bild zu ueberspringen. */
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
