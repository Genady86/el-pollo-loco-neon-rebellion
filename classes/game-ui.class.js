/** Steuert Menüs, Knöpfe und Anzeigen. */
class GameUI {
    /** Startet eine neue Spielrunde. */
    static startGame() {
        if (world) world.dispose();
        GameState.reset();
        GameControls.clearKeyboard();
        this.hideOverlays();
        document.getElementById('game-screen').hidden = false;
        world = new World(canvas, keyboard);
        this.updateHUD(world);
        this.setForgeStatus('⚒️ Neon-Schmiede: Sammle 3 Münzen!');
        this.updatePauseButton();
        this.updateSoundButton();
        audioManager.updatePlayback();
    }

    /** Zeigt das Startmenü und stoppt das Spiel. */
    static showHome() {
        if (world) world.dispose();
        world = null;
        GameControls.clearKeyboard();
        audioManager.stopAll();
        this.hideOverlays();
        document.getElementById('game-screen').hidden = true;
        document.getElementById('home-screen').hidden = false;
    }

    /** Zeigt Sieg oder Niederlage an. */
    static showResult(victory) {
        const dialog = document.getElementById('result-screen');
        document.getElementById('result-title').textContent = victory ? 'SIEG!' : 'GAME OVER';
        document.getElementById('result-text').textContent = victory
            ? 'El Pollo Grande ist besiegt!'
            : 'Pico braucht einen neuen Versuch.';
        dialog.hidden = false;
        GameControls.clearKeyboard();
    }

    /** Zeigt Münzen, Flaschen und Leben an. */
    static updateHUD(game) {
        document.getElementById('coin-count').textContent =
            `${game.collectedCoins} / ${game.coins.length}`;
        document.getElementById('bottle-count').textContent = String(game.bottleCount);
        document.getElementById('life-count').textContent = `${game.energy} / 100`;
        document.getElementById('boss-count').textContent = `${game.endboss.energy} / 100`;
        game.updateBars();
        this.updateForgeHint(game);
    }

    /** Zeigt verfügbare Münzen und Schmiedebereitschaft. */
    static updateForgeHint(game) {
        const element = document.getElementById('forge-status');
        if (!element || !game.forge) return;
        const available = game.collectedCoins - game.coinsSpent;
        const ready = available >= game.forge.price;
        element.classList.toggle('forge-ready', ready);
        element.textContent = ready
            ? '⚒️ Schmiede bereit! E drücken: +2 Flaschen.'
            : '⚒️ Schmiede: ' + available + '/3 verfügbare Münzen.';
    }

    /** Zeigt einen Hinweis zur Schmiede. */
    static setForgeStatus(message) {
        document.getElementById('forge-status').textContent = message;
    }

    /** Öffnet die Spielanleitung. */
    static showHelp() {
        document.getElementById('help-dialog').hidden = false;
    }

    /** Pausiert das Spiel oder macht weiter. */
    static togglePause() {
        if (!world || world.ended) return;
        GameState.setPaused(!GameState.isPaused);
        GameControls.clearKeyboard();
        audioManager.updatePlayback();
        this.updatePauseButton();
    }

    /** Ändert den Text auf dem Pause-Knopf. */
    static updatePauseButton() {
        const button = document.getElementById('pause-btn');
        button.textContent = GameState.isPaused ? '▶ Weiter' : '⏸ Pause';
        button.setAttribute('aria-pressed', String(GameState.isPaused));
    }

    /** Schaltet den Ton an oder aus. */
    static toggleSound() {
        audioManager.setEnabled(!audioManager.enabled);
        this.updateSoundButton();
    }

    /** Ändert den Text auf dem Ton-Knopf. */
    static updateSoundButton() {
        const button = document.getElementById('sound-btn');
        button.textContent = audioManager.enabled ? '🔊 Ton an' : '🔇 Ton aus';
        button.setAttribute('aria-pressed', String(audioManager.enabled));
    }

    /** Schließt die offenen Menüs. */
    static hideOverlays() {
        ['home-screen', 'result-screen', 'help-dialog'].forEach((id) => {
            document.getElementById(id).hidden = true;
        });
    }

    /** Verbindet die Knöpfe mit ihren Aufgaben. */
    static bindButtons() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('restart-btn').addEventListener('click', () => this.startGame());
        document
            .getElementById('game-restart-btn')
            .addEventListener('click', () => this.startGame());
        document.getElementById('home-btn').addEventListener('click', () => this.showHome());
        document.getElementById('sound-btn').addEventListener('click', () => this.toggleSound());
        document.getElementById('pause-btn').addEventListener('click', () => this.togglePause());
        document.getElementById('help-btn').addEventListener('click', () => this.showHelp());
        document.getElementById('help-close').addEventListener('click', () => this.closeHelp());
        document
            .getElementById('fullscreen-btn')
            .addEventListener('click', () => this.fullscreen());
    }

    /** Schließt die Spielanleitung. */
    static closeHelp() {
        document.getElementById('help-dialog').hidden = true;
    }

    /** Öffnet das Spiel im Vollbild. */
    static fullscreen() {
        const page = document.documentElement;
        if (page.requestFullscreen) page.requestFullscreen().catch(() => {});
    }

    /** Aktiviert die Knöpfe und die Steuerung. */
    static init() {
        this.bindButtons();
        GameControls.init();
        document.querySelectorAll('[data-close-help]').forEach((item) => {
            item.addEventListener('click', () => this.closeHelp());
        });
        this.updateSoundButton();
        this.showHome();
    }
}
