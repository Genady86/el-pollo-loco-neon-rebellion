/** Musik und Sounds; Mute-Status bleibt in Local Storage erhalten. */
class AudioManager {
    constructor() {
        this.music = new Audio('audio/music/PICO_NEON_FIESTA_RUSH_Game_Audio.ogg');
        this.music.loop = true;
        this.music.volume = .25;
        this.sounds = {
            jump: this.createSound('audio/sfx/character/characterJump.ogg', .45),
            coin: this.createSound('audio/sfx/collectibles/collectSound.ogg', .55),
            bandit: this.createSound('audio/sfx/chicken/chickenDead.ogg', .55),
        };
        this.enabled = this.readMutePreference();
    }

    /** Liest die vorige Benutzereinstellung robust ein. */
    readMutePreference() {
        try { return localStorage.getItem('epl-sound-enabled') === 'true'; }
        catch { return false; }
    }

    /** Speichert den Soundzustand. */
    setEnabled(enabled) {
        this.enabled = Boolean(enabled);
        try { localStorage.setItem('epl-sound-enabled', String(this.enabled)); }
        catch { /* Private-Surfen kann Storage sperren. */ }
        this.updatePlayback();
    }

    /** Erzeugt Sounds aus vorhandenen Projektdateien. */
    createSound(path, volume) {
        const sound = new Audio(path);
        sound.volume = volume;
        sound.preload = 'auto';
        return sound;
    }

    /** Spielt benannte Effekte nur bei aktivem Sound ab. */
    playSound(name) {
        if (!this.enabled || GameState.isPaused) return;
        const sound = this.sounds[name];
        if (!sound) return;
        sound.pause();
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }

    /** Stoppt Musik und alle Sounds bei Pause, Ende oder Mute. */
    updatePlayback(forceStop = false) {
        if (!this.enabled || GameState.isPaused || forceStop) return this.stopAll();
        this.music.play().catch(() => {});
    }

    /** Stoppt alle Tonquellen sofort. */
    stopAll() {
        this.music.pause();
        Object.values(this.sounds).forEach((sound) => {
            sound.pause();
            sound.currentTime = 0;
        });
    }
}
