class World {
    character;

    enemies = [new Chicken(), new Chicken(), new Chicken()];

    clouds = [];
    wasColliding = false;

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.character = new Character(keyboard);

        // Gegner vorläufig an festen Testpositionen
        this.enemies[0].x = 300;
        this.enemies[1].x = 425;
        this.enemies[2].x = 550;

        // Patrouillen beginnen an den festgelegten Positionen
        this.enemies.forEach((enemy) => {
            enemy.startX = enemy.x;
        });

        // Kollisionserkennung starten
        this.startCollisionDetection();

        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawObject(this.character);

        this.enemies.forEach((enemy) => {
            this.drawObject(enemy);
        });

        requestAnimationFrame(() => {
            this.draw();
        });
    }

    drawObject(object) {
        if (object.img && object.img.complete && object.img.naturalWidth > 0) {
            this.ctx.save();

            if (object.otherDirection) {
                // Figur horizontal spiegeln
                this.ctx.translate(object.x + object.width, object.y);
                this.ctx.scale(-1, 1);

                this.ctx.drawImage(object.img, 0, 0, object.width, object.height);
            } else {
                // Figur normal zeichnen
                this.ctx.drawImage(object.img, object.x, object.y, object.width, object.height);
            }

            this.ctx.restore();
        }
    }

    /** Startet die regelmäßige Kollisionsprüfung. */
    startCollisionDetection() {
        setInterval(() => this.checkCollisions(), 1000 / 30);
    }

    /** Prüft, ob Pico einen Gegner berührt. */
    checkCollisions() {
        let collision = this.enemies.some((enemy) => {
            return this.character.isColliding(enemy);
        });

        if (collision && !this.wasColliding) {
            console.log('Pico berührt einen Gegner!');
        }

        this.wasColliding = collision;
    }
}
