class World {
    character;

    enemies = [new Chicken(), new Chicken(), new Chicken()];

    clouds = [];

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Hintergrundbild für Level 1 laden
        this.background = new Image();
        this.background.src = 'img/backgrounds/fiesta-level1-demo.png';

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

    /** Zeichnet die komplette Spielwelt. */
    draw() {
        // Alte Bilder entfernen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();

        // Pico zeichnen
        this.drawObject(this.character);

        // Lebende und sterbende Gegner zeichnen
        this.enemies.forEach((enemy) => {
            if (!enemy.isRemoved) {
                this.drawObject(enemy);
            }
        });

        // Nächstes Bild zeichnen
        requestAnimationFrame(() => this.draw());
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

    /** Prüft jeden lebenden Gegner auf Kollisionen. */
    checkCollisions() {
        this.enemies.forEach((enemy) => {
            // Besiegte Gegner überspringen
            if (enemy.isDead) return;

            const collision = this.character.isColliding(enemy);

            if (collision && !enemy.wasColliding) {
                this.reportCollision(enemy);
            }

            enemy.wasColliding = collision;
        });
    }

    /** Reagiert auf einen Gegnerkontakt. */
    reportCollision(enemy) {
        if (this.character.isStomping(enemy)) {
            // Bandit besiegt
            enemy.die();

            // Pico springt nach dem Treffer wieder hoch
            this.character.speedY = 15;

            console.log('Bandit besiegt!');
        } else {
            console.log('Anderer Gegnerkontakt!');
        }
    }
    /** Zeichnet den Hintergrund von Level 1. */
    drawBackground() {
        if (!this.background.complete || !this.background.naturalWidth) {
            return;
        }

        this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
    }
}
