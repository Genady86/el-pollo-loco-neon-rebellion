class AudioManager {
    constructor() {
        // ========================================
        // HINTERGRUNDMUSIK
        // ========================================

        this.music = new Audio('audio/music/PICO_NEON_FIESTA_RUSH_Game_Audio.ogg');

        this.music.loop = true;
        this.music.volume = 0.25;

        // Ton startet erst nach einem Benutzerklick
        this.enabled = false;

        // ========================================
        // SOUNDEFFEKTE
        // ========================================

        this.sounds = {
            jump: this.createSound('audio/sfx/character/characterJump.ogg', 0.45),

            coin: this.createSound('audio/sfx/collectibles/collectSound.ogg', 0.55),

            bandit: this.createSound('audio/sfx/chicken/chickenDead.ogg', 0.55),
        };
    }

    /** Erstellt einen Sound mit eigener Lautstaerke. */
    createSound(path, volume) {
        const sound = new Audio(path);

        sound.preload = 'auto';
        sound.volume = volume;

        return sound;
    }

    /** Schaltet Musik und Soundeffekte ein oder aus. */
    setEnabled(enabled) {
        this.enabled = enabled;
        this.updatePlayback();
    }

    /** Spielt einen Soundeffekt ab. */
    playSound(name) {
        // Kein Sound bei Stummschaltung oder Pause
        if (!this.enabled || GameState.isPaused) return;

        const sound = this.sounds[name];

        if (!sound) {
            console.warn('Unbekannter Sound:', name);
            return;
        }

        // Sound bei erneutem Ereignis neu starten
        sound.pause();
        sound.currentTime = 0;

        sound.play().catch((error) => {
            console.warn('Sound konnte nicht starten:', name, error);
        });
    }

    /** Steuert Musik und Soundeffekte bei Pause. */
    updatePlayback() {
        if (!this.enabled || GameState.isPaused) {
            // Hintergrundmusik anhalten
            this.music.pause();

            // Laufende Soundeffekte ebenfalls stoppen
            Object.values(this.sounds).forEach((sound) => {
                sound.pause();
                sound.currentTime = 0;
            });

            return;
        }

        // Musik nur starten, wenn sie nicht schon laeuft
        if (this.music.paused) {
            this.music.play().catch((error) => {
                console.warn('Musik konnte nicht starten:', error);
            });
        }
    }
}
