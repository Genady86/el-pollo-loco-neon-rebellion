class Cloud extends MovableObject {
    /** Erstellt eine Wolke mit eigener Position und Geschwindigkeit. */
    constructor(x = 100, y = 25, speed = 0.15, scale = 1) {
        super();

        this.loadImage('img/clouds/fiesta-cloud.svg');

        // Position der Wolke
        this.x = x;
        this.y = y;

        // Groesse der Wolke
        this.width = 180 * scale;
        this.height = 85 * scale;

        // Individuelle Bewegungsgeschwindigkeit
        this.speed = speed;

        this.animate();
    }

    /** Bewegt die Wolke langsam nach links. */
    animate() {
        setInterval(() => {
            // Bei Pause bleibt die Wolke stehen
            if (GameState.isPaused) return;

            this.x -= this.speed;

            // Wolke nach Verlassen der Spielwelt
            // rechts wieder erscheinen lassen
            if (this.x + this.width < 0) {
                this.x = 2160;
            }
        }, 1000 / 60);
    }
}
