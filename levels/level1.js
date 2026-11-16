const level1 = new Level(
    // Gegner
    [new Chicken(), new Chicken(), new Chicken()],

    // Sechs Wolken
    [
        new Cloud(90, 25, 0.1, 0.8),
        new Cloud(380, 65, 0.16, 1.0),
        new Cloud(760, 30, 0.12, 0.9),
        new Cloud(1110, 55, 0.22, 0.75),
        new Cloud(1510, 24, 0.14, 1.1),
        new Cloud(1900, 67, 0.18, 0.95),
    ],

    // Hintergrund
    [
        new BackgroundObject('img/backgrounds/fiesta-level1-01.png', 0, 0),
        new BackgroundObject('img/backgrounds/fiesta-level1-02.png', 720, 0),
        new BackgroundObject('img/backgrounds/fiesta-level1-03.png', 1440, 0),
    ],

    // Muenzen
    [
        new Coin(260, 320),
        new Coin(670, 235),
        new Coin(1040, 320),
        new Coin(1430, 320),
        new Coin(1840, 320),
    ],

    // Drei Neon-Kakteen
    [
        new Obstacle(800, 360, 55, 80),
        new Obstacle(1260, 350, 65, 90),
        new Obstacle(1700, 365, 50, 75),
    ],

    // Neon-Schmiede als Zwischenziel
    new Forge(1110, 285),
);
