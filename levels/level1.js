const level1 = new Level(
    // Gegner
    [new Chicken(), new Chicken(), new Chicken()],

    // Wolken
    [new Cloud()],

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
);
