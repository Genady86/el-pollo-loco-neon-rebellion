class MovableObject {
    x = 120;
    y = 250;
    img;
    height = 150;
    width = 100;

    imageCache = {};
    currentImage = 0;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(paths) {
        paths.forEach((path) => {
            let image = new Image();
            image.src = path;
            this.imageCache[path] = image;
        });
    }

    playAnimation(images) {
        let index = this.currentImage % images.length;
        let path = images[index];

        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.x += 5;
    }

    moveLeft() {
        this.x -= 5;
    }
}
