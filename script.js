let canvas = document.getElementById('canvas');
let keyboard = new Keyboard();

// ========================================
// AUDIO-MANAGER
// ========================================

const audioManager = new AudioManager();

// ========================================
// TASTATURSTEUERUNG
// ========================================

// Taste wird gedrueckt
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

// ========================================
// SOUND AN / AUS
// ========================================

const soundButton = document.getElementById('sound-btn');

soundButton.addEventListener('click', () => {
    // Aktuellen Zustand umkehren
    const enabled = !audioManager.enabled;

    // Echte Musiksteuerung aufrufen
    audioManager.setEnabled(enabled);

    // Beschriftung anpassen
    soundButton.textContent = enabled ? '🔊 Ton an' : '🔇 Ton aus';

    soundButton.setAttribute('aria-pressed', String(enabled));

    console.log('Sound aktiviert:', enabled);
});

// ========================================
// SPIEL NEU STARTEN
// ========================================

const restartButton = document.getElementById('restart-btn');

restartButton.addEventListener('click', () => {
    window.location.reload();
});

// ========================================
// SPIELWELT STARTEN
// ========================================

let world = new World(canvas, keyboard);

// ========================================
// SPIEL PAUSIEREN / FORTSETZEN
// ========================================

const pauseButton = document.getElementById('pause-btn');

pauseButton.addEventListener('click', () => {
    const paused = GameState.togglePause();

    // Gedrueckte Tasten zuruecksetzen
    keyboard.LEFT = false;
    keyboard.RIGHT = false;
    keyboard.SPACE = false;

    world.character.jumpKeyWasDown = false;

    // Pause-Button aktualisieren
    pauseButton.textContent = paused ? '▶ Fortsetzen' : '⏸ Pause';

    pauseButton.setAttribute('aria-pressed', String(paused));

    // Jetzt wird auch die Musik pausiert!
    audioManager.updatePlayback();

    console.log('Spiel pausiert:', paused);
});

/* ========================================
   NEON-SCHMIEDE - INTERAKTION
======================================== */

window.addEventListener('keydown', (event) => {
    // Nur einmal beim Druecken von E ausfuehren
    if (event.code !== 'KeyE' || event.repeat) return;

    // Waehrend der Pause keine Interaktion
    if (GameState.isPaused) return;

    // Pruefen, ob eine Schmiede existiert
    if (!world.forge) return;

    // Mittelpunkt von Pico und Schmiede
    const picoX = world.character.x + world.character.width / 2;
    const forgeX = world.forge.x + world.forge.width / 2;

    // Entfernung berechnen
    const distance = Math.abs(picoX - forgeX);

    if (distance <= 150) {
        console.log('Neon-Schmiede erreicht!');

        document.getElementById('forge-status').textContent =
            '⚒️ Schmiede betreten! Zwei Revolver verfügbar.';
    } else {
        console.log('Pico ist zu weit von der Schmiede entfernt.');
    }
});
