class World {
    character = new Character();

    enemies = [new Chicken(), new Chicken(), new Chicken()];

    // Wolken kommen im nächsten Schritt dazu.
    clouds = [];

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Hühner für den Test nebeneinander platzieren
        this.enemies[0].x = 300;
        this.enemies[1].x = 425;
        this.enemies[2].x = 550;

        this.draw();
    }

    draw() {
        // Canvas komplett löschen.
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Pico zeichnen.
        this.drawObject(this.character);

        // Alle Hühner zeichnen.
        this.enemies.forEach((enemy) => {
            this.drawObject(enemy);
        });

        // Nächstes Bild zeichnen.
        requestAnimationFrame(() => {
            this.draw();
        });
    }

    drawObject(object) {
        // Nur bereits geladene Bilder zeichnen.
        if (object.img && object.img.complete && object.img.naturalWidth > 0) {
            this.ctx.drawImage(object.img, object.x, object.y, object.width, object.height);
        }
    }
}
