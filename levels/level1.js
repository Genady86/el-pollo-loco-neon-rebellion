const level1 = new Level(
    // ========================================
    // GEGNER
    // ========================================
    [new Chicken(), new Chicken(), new Chicken()],

    // ========================================
    // PREMIUM-WOLKEN
    // ========================================
    [
        new Cloud(90, 25, 0.1, 0.8),
        new Cloud(380, 65, 0.16, 1.0),
        new Cloud(760, 30, 0.12, 0.9),
        new Cloud(1110, 55, 0.22, 0.75),
        new Cloud(1510, 24, 0.14, 1.1),
        new Cloud(1900, 67, 0.18, 0.95),
    ],

    // ========================================
    // HINTERGRUND
    // ========================================
    [
        new BackgroundObject('img/backgrounds/fiesta-level1-01.png', 0, 0),
        new BackgroundObject('img/backgrounds/fiesta-level1-02.png', 720, 0),
        new BackgroundObject('img/backgrounds/fiesta-level1-03.png', 1440, 0),
    ],

    // ========================================
    // MUENZEN
    // ========================================
    [
        new Coin(260, 320),
        new Coin(670, 235),
        new Coin(1040, 320),
        new Coin(1430, 320),
        new Coin(1840, 320),
    ],
);
