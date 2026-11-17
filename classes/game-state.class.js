/** Zentrale pausierbare Spielzeit. */
class GameState {
    static isPaused = false;
    static pausedAt = 0;
    static pausedDuration = 0;

    static now() {
        const time = this.isPaused ? this.pausedAt : Date.now();
        return time - this.pausedDuration;
    }

    static setPaused(paused) {
        if (paused === this.isPaused) return;
        if (paused) this.pausedAt = Date.now();
        else this.pausedDuration += Date.now() - this.pausedAt;
        this.isPaused = paused;
    }

    static reset() {
        this.isPaused = false;
        this.pausedAt = 0;
        this.pausedDuration = 0;
    }
}
