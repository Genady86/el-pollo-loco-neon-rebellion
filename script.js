let canvas = document.getElementById('canvas');
let keyboard = new Keyboard();

// Taste wird gedrückt
window.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        keyboard.RIGHT = true;
    }

    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        keyboard.LEFT = true;
    }

    if (event.code === 'Space' || event.code === 'ArrowUp') {
        keyboard.SPACE = true;
        event.preventDefault();
    }
});

// Taste wird losgelassen
window.addEventListener('keyup', (event) => {
    if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        keyboard.RIGHT = false;
    }

    if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        keyboard.LEFT = false;
    }

    if (event.code === 'Space' || event.code === 'ArrowUp') {
        keyboard.SPACE = false;
        event.preventDefault();
    }
});

// Spielwelt starten
let world = new World(canvas, keyboard);
