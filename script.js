let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let x = 250;
let y = 200;
let speed = 1;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(x, y, 80, 80);
}

function animate() {
    x = x + speed;

    if (x >= canvas.width - 80) {
        speed = -1;
    }

    if (x <= 0) {
        speed = 1;
    }

    draw();
    requestAnimationFrame(animate);
}

animate();
