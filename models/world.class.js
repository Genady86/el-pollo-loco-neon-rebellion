class World {
    character = new Character();

    enemies = [new Chicken(), new Chicken(), new Chicken()];

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }
}
