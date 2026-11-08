let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let x = 250;
let y = 200;
let speed = 3;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(x, y, 80, 80);
}

function animate() {
    x = x + speed;

    if (x >= canvas.width - 80) {
        speed = -3;
    }

    if (x <= 0) {
        speed = 3;
    }

    draw();
    requestAnimationFrame(animate);
}

// animate();

let world = new World(canvas);
