class Chicken extends MovableObject {
    constructor() {
        super();
        this.loadImage('img/chicken.svg');

        this.x = 200 + Math.random() * 500; // Zahl zwischen 200 und 700
    }
}
