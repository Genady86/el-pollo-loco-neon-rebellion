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

/* ========================================
   SOUND AN / AUS
======================================== */

// Sound ist standardmaessig eingeschaltet
let soundEnabled = true;

// Sound-Schaltflaeche aus HTML holen
const soundButton = document.getElementById('sound-btn');

// Auf einen Mausklick reagieren
soundButton.addEventListener('click', () => {
    // Zwischen an und aus wechseln
    soundEnabled = !soundEnabled;

    // Beschriftung aktualisieren
    if (soundEnabled) {
        soundButton.textContent = '🔊 Ton an';
    } else {
        soundButton.textContent = '🔇 Ton aus';
    }

    console.log('Sound aktiviert:', soundEnabled);
});

/* ========================================
   SPIEL NEU STARTEN
======================================== */

// Neustart-Schaltflaeche aus HTML holen
const restartButton = document.getElementById('restart-btn');

// Auf einen Klick reagieren
restartButton.addEventListener('click', () => {
    // Aktuelle Webseite neu laden
    window.location.reload();
});

// Spielwelt starten
let world = new World(canvas, keyboard);

/* ========================================
   SPIEL PAUSIEREN / FORTSETZEN
======================================== */

// Pause-Schaltflaeche aus HTML holen
const pauseButton = document.getElementById('pause-btn');

// Bei einem Klick zwischen Pause und Spielen wechseln
pauseButton.addEventListener('click', () => {
    const paused = GameState.togglePause();

    // Gedrueckte Bewegungstasten zuruecksetzen
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.SPACE = false;

    // Verhindert ungewollten Sprung nach Fortsetzen
    world.character.jumpKeyWasDown = false;

    // Beschriftung aktualisieren
    if (paused) {
        pauseButton.textContent = '▶ Fortsetzen';
    } else {
        pauseButton.textContent = '⏸ Pause';
    }

    // Zustand fuer Barrierefreiheit hinterlegen
    pauseButton.setAttribute('aria-pressed', String(paused));

    console.log('Spiel pausiert:', paused);
});
