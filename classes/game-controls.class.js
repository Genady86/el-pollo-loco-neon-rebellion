/** Liest die Tastatur und die Handy-Knöpfe. */
class GameControls {
    /** Setzt alle Tasten zurück. */
    static clearKeyboard() {
        keyboard.LEFT = false;
        keyboard.RIGHT = false;
        keyboard.SPACE = false;
        keyboard.THROW = false;
        if (world) world.character.jumpKeyWasDown = false;
        if (world) world.throwWasDown = false;
    }

    /** Reagiert auf die Tasten am Computer. */
    static handleKey(event, pressed) {
        const keys = { ArrowLeft: 'LEFT', KeyA: 'LEFT', ArrowRight: 'RIGHT',
            KeyD: 'RIGHT', Space: 'SPACE', ArrowUp: 'SPACE', KeyF: 'THROW' };
        if (event.code === 'KeyE') return this.handleForgeKey(event, pressed);
        const key = keys[event.code];
        if (!key) return;
        keyboard[key] = pressed;
        event.preventDefault();
        this.handleImmediateKey(key, pressed);
    }

    /** Benutzt mit E die Schmiede. */
    static handleForgeKey(event, pressed) {
        event.preventDefault();
        if (!pressed || event.repeat || !world || world.ended || GameState.isPaused) return;
        world.interactWithForge();
    }

    /** Startet Springen oder Werfen. */
    static handleImmediateKey(key, pressed) {
        if (!world || world.ended || GameState.isPaused) return;
        if (key === 'THROW') this.tryThrow(pressed);
        if (key === 'SPACE') this.tryJump(pressed);
    }

    /** Wirft mit F eine Flasche. */
    static tryThrow(pressed) {
        if (pressed) world.checkThrowInput();
        else world.throwWasDown = false;
    }

    /** Lässt Pico springen. */
    static tryJump(pressed) {
        if (pressed) world.character.checkJump();
        else world.character.jumpKeyWasDown = false;
    }

    /** Aktiviert die Knöpfe auf dem Handy. */
    static bindTouch() {
        document.querySelectorAll('[data-key]').forEach((button) => {
            const key = button.dataset.key;
            button.addEventListener('contextmenu', (event) => event.preventDefault());
            button.addEventListener('dragstart', (event) => event.preventDefault());
            button.addEventListener('pointerdown', (event) => this.touchKey(event, key, true));
            button.addEventListener('pointerup', (event) => this.touchKey(event, key, false));
            button.addEventListener('pointercancel', (event) => this.touchKey(event, key, false));
            button.addEventListener('pointerleave', (event) => this.touchKey(event, key, false));
        });
    }

    /** Reagiert auf die Handy-Knöpfe. */
    static touchKey(event, key, pressed) {
        event.preventDefault();
        if (key === 'FORGE') {
            if (pressed && world && !world.ended && !GameState.isPaused) {
                world.interactWithForge();
            }
            return;
        }
        keyboard[key] = pressed;
        this.handleImmediateKey(key, pressed);
    }

    /** Schaltet die Tastatursteuerung ein. */
    static init() {
        this.bindTouch();
        window.addEventListener('keydown', (event) => this.handleKey(event, true));
        window.addEventListener('keyup', (event) => this.handleKey(event, false));
        window.addEventListener('blur', () => this.clearKeyboard());
    }
}
