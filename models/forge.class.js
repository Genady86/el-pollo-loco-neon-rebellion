class Forge extends MovableObject {
    constructor(x, y) {
        super();

        // Position aus unserem Level uebernehmen
        this.x = x;
        this.y = y;

        // Schmiede kleiner darstellen
        this.width = 175;
        this.height = 155;

        // Preis fuer beide Revolver
        this.price = 3;

        // Vorhandene Grafik laden
        this.loadImage('img/forge/neon-forge.svg');
    }
}
