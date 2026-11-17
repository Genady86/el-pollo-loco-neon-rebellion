/** Gemeinsame Basis fuer Spielfiguren und Levelobjekte. */
class MovableObject {
    x = 120;
    y = 250;
    width = 100;
    height = 150;
    img = null;
    imageCache = {};
    currentImage = 0;
    offsetTop = 0;
    offsetBottom = 0;
    offsetLeft = 0;
    offsetRight = 0;
    isRemoved = false;

    /** Laedt ein Sprite ueber den vorgegebenen relativen Pfad. */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /** Laedt alle Frames einmal in den Bildcache. */
    loadImages(paths) {
        paths.forEach((path) => {
            const image = new Image();
            image.src = path;
            this.imageCache[path] = image;
        });
    }

    /** Wechselt zum naechsten Frame. */
    playAnimation(images) {
        if (!images.length) return;
        const path = images[this.currentImage % images.length];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /** Berechnet die rechteckige Hitbox unter Beruecksichtigung aller Offsets. */
    hitbox() {
        return {
            left: this.x + this.offsetLeft,
            right: this.x + this.width - this.offsetRight,
            top: this.y + this.offsetTop,
            bottom: this.y + this.height - this.offsetBottom,
        };
    }

    /** True, wenn sich zwei tatsaechliche Trefferflaechen schneiden. */
    isColliding(other) {
        const a = this.hitbox();
        const b = other.hitbox();
        return a.left < b.right && a.right > b.left &&
            a.top < b.bottom && a.bottom > b.top;
    }
}
