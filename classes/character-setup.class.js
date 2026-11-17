/** Gibt Pico seine Startwerte. */
class CharacterSetup {
    constructor(character) {
        this.character = character;
    }

    /** Legt Picos Startposition und Sprungwerte fest. */
    setupPosition() {
        const pico = this.character;
        pico.x = 90;
        pico.y = 290;
        pico.groundY = 290;
        pico.previousY = pico.y;
        pico.levelWidth = 2480;
        pico.obstacles = [];
        pico.speedY = 0;
        pico.acceleration = 1450;
    }

    /** Setzt Pico am Anfang auf normal. */
    setupState() {
        const pico = this.character;
        pico.jumpKeyWasDown = false;
        pico.isMoving = false;
        pico.isDead = false;
        pico.isSleeping = false;
        pico.otherDirection = false;
        pico.hurtUntil = 0;
        this.setupIdleState();
    }

    /** Legt fest, wann Pico zuletzt gewartet hat. */
    setupIdleState() {
        const pico = this.character;
        pico.idleSince = GameState.now();
        pico.danceSince = 0;
        pico.dancePlayed = false;
        pico.currentAnimation = '';
        pico.lastAnimationAt = 0;
    }

    /** Legt fest, wo Pico getroffen werden kann. */
    setupHitbox() {
        const pico = this.character;
        pico.offsetLeft = 25;
        pico.offsetRight = 25;
        pico.offsetTop = 20;
        pico.offsetBottom = 15;
    }
}
