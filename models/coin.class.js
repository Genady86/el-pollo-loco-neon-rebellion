class Coin extends MovableObject {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 45;
        this.height = 45;
        this.loadImage('img/coins/coin.svg');
    }
}
