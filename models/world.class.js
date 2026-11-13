class World {
    character;

    // Breite unserer gesamten Spielwelt
    levelWidth = 2160;

    // Aktuelle Position unserer Kamera
    cameraX = 0;

    enemies = [new Chicken(), new Chicken(), new Chicken()];

    clouds = [new Cloud()];

    // Drei Hintergrundabschnitte mit jeweils 720 Pixeln
    backgroundObjects = [
        new BackgroundObject('img/backgrounds/fiesta-level1-demo.png', 0, 0),
        new BackgroundObject('img/backgrounds/fiesta-level1-demo.png', 720, 0),
        new BackgroundObject('img/backgrounds/fiesta-level1-demo.png', 1440, 0),
    ];

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.character = new Character(keyboard);
        this.character.levelWidth = this.levelWidth;

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

    /** Zeichnet die komplette Spielwelt mit Kamera. */
    draw() {
        // Kamera folgt Pico, bleibt aber innerhalb des Levels
        this.cameraX = Math.max(
            0,
            Math.min(
                this.character.x + this.character.width / 2 - this.canvas.width / 2,
                this.levelWidth - this.canvas.width,
            ),
        );

        // Vorherigen Bildschirm löschen
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Kamera aktivieren
        this.ctx.save();
        this.ctx.translate(-this.cameraX, 0);

        // Spielobjekte zeichnen
        this.addObjectsToMap(this.backgroundObjects);
        this.addObjectsToMap(this.clouds);
        this.drawObject(this.character);
        this.addObjectsToMap(this.enemies);

        // Kamera zurücksetzen
        this.ctx.restore();

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
    /** Zeichnet alle Objekte aus einem Array. */
    addObjectsToMap(objects) {
        objects.forEach((object) => {
            if (!object.isRemoved) {
                this.drawObject(object);
            }
        });
    }
}
