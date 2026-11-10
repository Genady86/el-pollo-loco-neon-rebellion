class Chicken extends MovableObject {
    startX = 0;
    movingRight = false;

    constructor() {
        super();

        this.loadImage('img/enemies/pollo-bandido-idle-01.png');

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
}
