/** Erzeugt pro Spielrunde vollstaendig frische Levelobjekte. */
function createLevel1() {
    return new Level(createEnemies(), createClouds(), createBackgroundObjects(),
        createCoins(), createBottles(), createObstacles(), new Endboss(2180),
        new Forge(1110, 285));
}

/** Zwei Gegnertypen: normaler Bandido und schnelles Chicken. */
function createEnemies() {
    return [new Chicken(480), new SmallChicken(790), new Chicken(1090),
        new SmallChicken(1510), new Chicken(1830)];
}

/** Wolken mit leicht unterschiedlichen Geschwindigkeiten. */
function createClouds() {
    return [new Cloud(90, 25, .1, .8), new Cloud(380, 65, .16, 1),
        new Cloud(760, 30, .12, .9), new Cloud(1110, 55, .22, .75),
        new Cloud(1510, 24, .14, 1.1), new Cloud(1900, 67, .18, .95)];
}

/** Drei bereits vorhandene Original-Hintergrundbilder. */
function createBackgroundObjects() {
    return [new BackgroundObject('img/backgrounds/fiesta-level1-01.png', 0),
        new BackgroundObject('img/backgrounds/fiesta-level1-02.png', 720),
        new BackgroundObject('img/backgrounds/fiesta-level1-03.png', 1440)];
}

/** Fuenf Originalmuenzen. */
function createCoins() {
    return [new Coin(260, 320), new Coin(670, 235), new Coin(1040, 320),
        new Coin(1430, 320), new Coin(1840, 320)];
}

/** Sechs Flaschen fuer mindestens fuenf notwendige Bosstreffer. */
function createBottles() {
    return [new Bottle(300), new Bottle(590), new Bottle(970),
        new Bottle(1360), new Bottle(1660), new Bottle(2020)];
}

/** Kakteen stehen an denselben Stellen wie in der Basis. */
function createObstacles() {
    return [new Obstacle(860, 360, 55, 80), new Obstacle(1260, 350, 65, 90),
        new Obstacle(1750, 365, 50, 75)];
}
