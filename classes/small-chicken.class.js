/** Zweiter Gegnertyp: kleiner, schneller, geringere Trefferflaeche. */
class SmallChicken extends Chicken {
    constructor(x) {
        super(x);
        this.width = 70;
        this.height = 95;
        this.y = 345;
        this.speed = 110;
        this.offsetLeft = 12;
        this.offsetRight = 12;
        this.offsetTop = 12;
        this.offsetBottom = 8;
        this.visualFilter = 'hue-rotate(125deg)';
    }
}
