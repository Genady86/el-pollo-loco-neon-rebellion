/** Verwaltet die Partikeleffekte fuer Treffer und Landungen. */
class ParticleManager {
    constructor(world) {
        this.world = world;
    }

    /** Erstellt hoechstens 120 aktive Partikel. */
    emitParticles(x, y, color) {
        const particles = this.world.particles;
        for (let i = 0; i < 8; i++) particles.push(new Particle(x, y, color));
        if (particles.length > 120) particles.splice(0, particles.length - 120);
    }

    /** Aktualisiert Effekte und entfernt verblasste Partikel. */
    updateParticles(dt) {
        const world = this.world;
        world.particles.forEach((item) => item.update(dt));
        world.particles = world.particles.filter((item) => item.opacity > 0);
    }

    /** Zeigt Funken, wenn Pico wieder den Boden beruehrt. */
    updateLanding() {
        const world = this.world;
        const above = world.character.isAboveGround();
        if (world.lastAboveGround && !above) {
            this.emitParticles(world.character.x + 40, world.character.y + 140, '#ffe087');
        }
        world.lastAboveGround = above;
    }
}
