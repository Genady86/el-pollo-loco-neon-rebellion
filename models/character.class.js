class Character extends MovableObject {
    IMAGES_WALKING = [
        'img/player/player-run-01.png',
        'img/player/player-run-02.png',
        'img/player/player-run-03.png',
        'img/player/player-run-04.png',
        'img/player/player-run-05.png',
        'img/player/player-run-06.png',
    ];

    constructor() {
        super();

        this.y = 270;
        this.loadImages(this.IMAGES_WALKING);
        this.img = this.imageCache[this.IMAGES_WALKING[0]];

        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 120);
    }
}
