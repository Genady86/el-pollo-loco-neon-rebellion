class Cloud extends MovableObject {
    constructor() {
        super();

        this.loadImage('img/clouds/fiesta-cloud.svg');

        this.x = 100 + Math.random() * 500;
        this.y = 25;
        this.width = 180;
        this.height = 85;
        this.animate();
    }

    /** Bewegt die Wolke langsam nach links. */
    animate() {
        setInterval(() => {
            // Wolken bei Spielpause anhalten
            if (GameState.isPaused) return;

            this.x -= 0.15;

            if (this.x + this.width < 0) {
                this.x = 720;
            }
        }, 1000 / 60);
    }
}
