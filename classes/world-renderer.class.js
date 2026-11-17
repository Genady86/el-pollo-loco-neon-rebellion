/** Zeichnet Spielwelt, Parallax und HUD getrennt von der Spielphysik. */
class WorldRenderer {
    constructor(world) {
        this.world = world;
        this.ctx = world.ctx;
    }

    /** Reihenfolge der Ebenen bestimmt die Tiefenwirkung. */
    draw() {
        const world = this.world;
        this.ctx.clearRect(0, 0, world.canvas.width, world.canvas.height);
        this.drawBackground();
        this.drawObjects(world.clouds, .65);
        this.drawForeground();
        this.drawStatusBars();
    }

    /** Drei 720px-Hintergrundbilder wiederholen sich ohne Luecke. */
    drawBackground() {
        const images = this.world.backgroundObjects;
        const camera = this.world.cameraX * .75;
        const first = Math.floor(camera / 720);
        for (let i = first; i <= first + 2; i++) {
            const image = images[((i % images.length) + images.length) % images.length];
            if (!this.ready(image)) continue;
            this.ctx.drawImage(image.img, Math.round(i * 720 - camera), 0, 721, 480);
        }
    }

    /** Alle Gameplay-Objekte benutzen die normale Weltkamera. */
    drawForeground() {
        const world = this.world;
        this.drawObjects([world.forge], 1);
        this.drawObjects(world.coins, 1);
        this.drawObjects(world.bottles, 1);
        this.drawObjects(world.obstacles, 1);
        this.drawObjects(world.enemies, 1);
        this.drawObjects([world.endboss, world.character], 1);
        this.drawObjects(world.projectiles, 1);
        this.drawObjects(world.particles, 1);
    }

    /** Verschiebt Objekte um den passenden Kameraanteil. */
    drawObjects(objects, factor) {
        this.ctx.save();
        this.ctx.translate(-this.world.cameraX * factor, 0);
        objects.forEach((object) => {
            if (object && !object.isRemoved) this.drawObject(object);
        });
        this.ctx.restore();
    }

    /** Objekte mit eigener draw-Methode zeichnen sich selbst. */
    drawObject(object) {
        if (typeof object.draw === 'function') return object.draw(this.ctx);
        if (!this.ready(object)) return;
        this.ctx.save();
        if (object === this.world.character) this.applyCharacterEffects(object);
        if (object.visualFilter) this.ctx.filter = object.visualFilter;
        this.drawSprite(object);
        this.ctx.restore();
    }

    /** Blinkeffekt bei Schaden, lesbare Sleep-Markierung. */
    applyCharacterEffects(character) {
        if (character.isHurt()) this.ctx.globalAlpha = .65;
        if (character.isDead) this.ctx.filter = 'grayscale(1)';
        if (character.isSleeping) this.ctx.filter = 'brightness(.75)';
        if (character.isSleeping) this.drawSleepIndicator(character);
    }

    /** Sleep-Hinweis bis eine passende Sprite-Serie eingebunden ist. */
    drawSleepIndicator(character) {
        this.ctx.fillStyle = '#def8ff';
        this.ctx.font = 'bold 22px Arial';
        this.ctx.fillText('Zzz', character.x + 55, character.y - 5);
    }

    /** Zeichnet normale, schlafende und tote Figuren passend. */
    drawSprite(object) {
        const character = object === this.world.character;
        if (character && object.isSleeping) return this.drawSleepingSprite(object);
        if (character && object.isDead) return this.drawDefeatedSprite(object);
        if (character && object.isHurt()) this.ctx.filter = 'sepia(1) saturate(5)';
        this.drawWalkingSprite(object);
    }

    /** Figuren koennen sich vor dem Laufen nach links spiegeln. */
    drawWalkingSprite(object) {
        if (!object.otherDirection) {
            return this.ctx.drawImage(object.img, object.x, object.y, object.width, object.height);
        }
        this.ctx.translate(object.x + object.width, object.y);
        this.ctx.scale(-1, 1);
        this.ctx.drawImage(object.img, 0, 0, object.width, object.height);
    }

    /** Sleep-Animation: die vorhandene Figur liegt seitlich und atmet. */
    drawSleepingSprite(object) {
        const breathe = 1 + .02 * Math.sin(performance.now() / 420);
        this.ctx.translate(object.x + 25, object.y + 135);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.scale(breathe, 1);
        this.ctx.drawImage(object.img, 0, 0, object.width, object.height);
    }

    /** Todespose: Pico liegt dauerhaft am Boden. */
    drawDefeatedSprite(object) {
        this.ctx.translate(object.x + 25, object.y + 130);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.drawImage(object.img, 0, 0, object.width, object.height);
    }

    /** Verhindert Canvas-Fehler durch unvollstaendig geladene Assets. */
    ready(object) {
        return Boolean(object.img && object.img.complete && object.img.naturalWidth > 0);
    }

    /** Statusbars bleiben beim Scrollen an ihrer Bildschirmposition. */
    drawStatusBars() {
        this.world.playerBar.draw(this.ctx);
        this.world.bottleBar.draw(this.ctx);
        if (this.world.isBossVisible()) this.world.bossBar.draw(this.ctx);
    }
}
