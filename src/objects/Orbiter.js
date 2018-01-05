
class Orbiter extends Phaser.Sprite {

  constructor(game, x, y, key, frame, orbit) {
    super(game, x, y, key, frame);


    this.orbit = orbit;

    this.rotation = 0;
    this.rotationSpeed = 0;
    this.anchor.set(0.5);
  
    this.enableBody = true;
  }

  /**
   * Update the ship position and orientation
   */
  move(time) {
    const p = this.orbit.getPositionOfSecondary( time );
    this.x = p.x;
    this.y = p.y;

    // Assumes constant 60 FPS
    // https://photonstorm.github.io/phaser-ce/Phaser.Time.html#slowMotion
    this.rotation += this.rotationSpeed * this.game.time.slowMotion;
  }

  drawPath(graphics, time) {
    const start = this.orbit.getTrueAnomaly(time);
    const step = this.orbit.DIR*Math.PI/100;

    let pos = this.orbit.getPointOnEllipse(start);
    graphics.moveTo(pos.x, pos.y);

    for(let i=1; i<=100; i++) {
      pos = this.orbit.getPointOnEllipse(start + i * step);
      graphics.lineTo(pos.x, pos.y);
    }
  }

  remove() {
    this.game.world.remove(this);
  }
}
  
export default Orbiter;
  