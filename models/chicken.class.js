class Chicken extends MovableObject {
    /** Todesanimation von Pollo Bandido. */
    IMAGES_DEATH = [
        'img/enemies/pollo-bandido/death/pollo-bandido-death-01-hit-react.png',
        'img/enemies/pollo-bandido/death/pollo-bandido-death-02-dazed.png',
        'img/enemies/pollo-bandido/death/pollo-bandido-death-03-backflip.png',
        'img/enemies/pollo-bandido/death/pollo-bandido-death-04-defeated.png',
    ];
    startX = 0;
    movingRight = false;
    wasColliding = false;
    isDead = false;
    isRemoved = false;

    constructor() {
        super();

        this.loadImage('img/enemies/pollo-bandido-idle-01.png');
        // Alle Todesframes vorladen
        this.loadImages(this.IMAGES_DEATH);
        // Kollisionsbereich des Banditen
        this.offsetLeft = 20;
        this.offsetRight = 20;
        this.offsetTop = 25;
        this.offsetBottom = 15;

        // Zufällige Startposition
        this.x = 200 + Math.random() * 350;

        // Startposition merken
        this.startX = this.x;

        // Bewegung starten
        this.animate();
    }

    /** Startet die Bewegung des Gegners. */
    animate() {
        setInterval(() => this.patrol(), 1000 / 60);
    }

    /** Lässt das Chicken hin und her laufen. */
    patrol() {
        if (this.isDead) return;
        if (this.x <= this.startX - 60) {
            this.movingRight = true;
        }

        if (this.x >= this.startX + 60) {
            this.movingRight = false;
        }

        if (this.movingRight) {
            this.x += 1;
        } else {
            this.x -= 1;
        }

        this.otherDirection = this.movingRight;
    }

    /** Spielt die Todesanimation einmalig ab. */
    die() {
        if (this.isDead) return;

        this.isDead = true;
        this.img = this.imageCache[this.IMAGES_DEATH[0]];

        // Die drei folgenden Todesbilder anzeigen
        this.IMAGES_DEATH.slice(1).forEach((path, index) => {
            setTimeout(
                () => {
                    this.img = this.imageCache[path];
                },
                (index + 1) * 150,
            );
        });

        // Zwei Sekunden nach der letzten Pose verschwinden
        setTimeout(() => (this.isRemoved = true), 2450);
    }
}
