import Orbiter from 'objects/Orbiter';
import Orbit from 'lib/Orbit';
import Geometry from 'lib/Geometry';

class Spaceship extends Orbiter {

  constructor(game, x, y, key, frame, orbit) {
    super(game, x, y, key, frame, orbit);
  }

  // Constants
  get THRUST() { return 0.0002; }
  get ROTATE_THRUST() { return 0.0002908882; } // 1 deg/sec @ 60fps (radians)
  get FLING_FORCE() { return 0.015; }

  /**
   * Update the ship rotational speed
   */
  turn( direction ) {
    this.rotationSpeed += this.ROTATE_THRUST * direction;
  }

  /**
   * Fire ship thrusters
   * Replace orbit with a new orbit (based on changed velocity)
   */
  boost(time) {
    const orbit = this.orbit;
    const r = orbit.getRadiusOfSecondary( time );
    const ra = orbit.getAngleToSecondary( time );
    const v = orbit.getVelocityOfSecondary( time );
    const va = orbit.getDirectionOfSecondary( time );

    // Orbit and Geometry classes have 0 radians pointing to the right
    // Spaceship (Phaser.Sprite) class has 0 radians pointing up
    const direction = this.rotation - Math.PI/2;
    const newVel = Geometry.polarAdd( va, v, direction, this.THRUST );

    this.orbit = new Orbit( orbit.G, orbit.M, orbit.X, orbit.Y, r, ra, newVel.magnitude, newVel.direction, time );
  }

  /**
   * Launch Mine
   * Give mine a new orbit based on position, orientation and fling force
   */
  flingMine(time, mine) {
    mine.reset( this.x, this.y );
    mine.rotation = this.rotation;

    const orbit = this.orbit;
    const r = orbit.getRadiusOfSecondary( time );
    const ra = orbit.getAngleToSecondary( time );
    const v = orbit.getVelocityOfSecondary( time );
    const va = orbit.getDirectionOfSecondary( time );

    // Orbit and Geometry classes have 0 radians pointing to the right
    // Spaceship (Phaser.Sprite) class has 0 radians pointing up
    const direction = this.rotation - Math.PI/2;
    const newVel = Geometry.polarAdd( va, v, direction, this.FLING_FORCE );

    mine.orbit = new Orbit( orbit.G, orbit.M, orbit.X, orbit.Y, r, ra, newVel.magnitude, newVel.direction, time );
  }

}
  
export default Spaceship;
  