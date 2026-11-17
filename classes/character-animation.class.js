/** Zeigt Picos Bilder beim Laufen und Springen. */
class CharacterAnimation {
    constructor(character) {
        this.character = character;
    }

    /** Erstellt die Namen der Bilddateien. */
    imagePaths(prefix, count) {
        const paths = [];
        for (let i = 1; i <= count; i++) {
            paths.push(prefix + i + '.png');
        }
        return paths;
    }

    /** Legt fest, welche Bilder Pico benutzt. */
    setImagePaths() {
        const pico = this.character;
        pico.IMAGES_WALKING = this.imagePaths('img/player/player-run-0', 6);
        pico.IMAGES_IDLE = this.imagePaths('img/player/idle-premium/pico-idle-premium-0', 7);
        pico.IMAGES_DANCE = this.imagePaths('img/player/dance/pico-idle-funny-0', 6);
        pico.IMAGES_JUMPING = this.imagePaths('img/player/jump/pico-jump-0', 3);
        pico.IMAGES_FALLING = this.imagePaths('img/player/fall/pico-fall-0', 3);
    }

    /** Lädt alle Bilder für Picos Bewegungen. */
    loadAllImages() {
        const pico = this.character;
        this.setImagePaths();
        pico.loadImages(pico.IMAGES_WALKING);
        pico.loadImages(pico.IMAGES_IDLE);
        pico.loadImages(pico.IMAGES_DANCE);
        pico.loadImages(pico.IMAGES_JUMPING);
        pico.loadImages(pico.IMAGES_FALLING);
        pico.img = pico.imageCache[pico.IMAGES_IDLE[0]];
    }

    /** Wählt das passende Bild für Pico aus. */
    updateAnimation() {
        const pico = this.character;
        const now = GameState.now();
        if (pico.isAboveGround()) this.selectAirAnimation(now);
        else if (pico.isMoving) this.showAnimation('walk', pico.IMAGES_WALKING, now);
        else this.updateIdleAnimation(now);
    }

    /** Prüft, ob Pico hoch- oder runterfällt. */
    selectAirAnimation(now) {
        const pico = this.character;
        if (pico.speedY > 0) this.showAnimation('jump', pico.IMAGES_JUMPING, now);
        else this.showAnimation('fall', pico.IMAGES_FALLING, now);
    }

    /** Wechselt zum nächsten Bild. */
    showAnimation(state, images, now) {
        const pico = this.character;
        if (pico.currentAnimation !== state) {
            pico.currentAnimation = state;
            pico.currentImage = 0;
            pico.lastAnimationAt = 0;
        }
        if (now - pico.lastAnimationAt < 130) return;
        pico.playAnimation(images);
        pico.lastAnimationAt = now;
    }

    /** Startet die Wartezeit wieder bei null. */
    resetIdleState() {
        const pico = this.character;
        pico.idleSince = GameState.now();
        pico.isSleeping = false;
        pico.dancePlayed = false;
        pico.danceSince = 0;
        pico.currentAnimation = '';
    }

    /** Pico tanzt nach 10 Sekunden und ruht nach 15 Sekunden. */
    updateIdleAnimation(now) {
        const pico = this.character;
        const idleFor = now - pico.idleSince;
        pico.isSleeping = idleFor >= 15000;
        if (pico.isSleeping) return this.showAnimation('sleep', pico.IMAGES_IDLE, now);
        if (!pico.dancePlayed && idleFor >= 10000) this.startDance(now);
        if (pico.dancePlayed && now - pico.danceSince < 3000) {
            return this.showAnimation('dance', pico.IMAGES_DANCE, now);
        }
        this.showAnimation('idle', pico.IMAGES_IDLE, now);
    }

    /** Lässt Pico einmal tanzen. */
    startDance(now) {
        const pico = this.character;
        pico.dancePlayed = true;
        pico.danceSince = now;
        pico.currentAnimation = '';
    }
}
