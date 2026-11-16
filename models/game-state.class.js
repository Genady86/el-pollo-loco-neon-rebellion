class GameState {
    static isPaused = false;
    static pausedAt = 0;
    static pausedDuration = 0;

    /** Spielzeit ohne Pausenzeiten. */
    static now() {
        const time = this.isPaused ? this.pausedAt : Date.now();
        return time - this.pausedDuration;
    }

    /** Spiel anhalten oder fortsetzen. */
    static togglePause() {
        if (this.isPaused) {
            this.pausedDuration += Date.now() - this.pausedAt;
            this.isPaused = false;
        } else {
            this.pausedAt = Date.now();
            this.isPaused = true;
        }

        return this.isPaused;
    }
}
