/* eslint-disable no-console */
import Orbit from 'lib/Orbit';
import Geometry from 'lib/Geometry';


class Level1State extends Phaser.State {

  create() {
    const game = this.game;

    game.stage.backgroundColor = '#000000';
    game.world.setBounds( -2000, -2000, 4000, 4000 );

    game.physics.startSystem( Phaser.Physics.ARCADE );

    // Drawing surface for orbit paths
    this.paths = game.add.graphics( 0, 0 );

    // Planet
    const planet = game.add.sprite( 0, 0, 'planet' );
    planet.anchor.set( 0.5 );
    planet.scale.set( 2 );
    planet.enableBody = true;
    game.physics.enable( planet, Phaser.Physics.ARCADE );
    this.planet = planet;

    // Ship
    const ship = {
      angle: 0,
      omega: 0,
      sprite: null,
      orbit: null
    };
    ship.sprite = game.add.sprite( 0, 300, 'ship' );
    ship.sprite.anchor.set( 0.5 );
    //ship.sprite.scale.set( 0.5 );
    ship.sprite.enableBody = true;
    game.physics.enable( ship.sprite, Phaser.Physics.ARCADE );
    const v = Math.sqrt( ( 0.1 * 10 ) / 300 );
    ship.orbit = new Orbit( 0.1, 10, 0, 0, 300, Math.PI * 0.5, v, 0 );
    this.ship = ship;

    // Mines/Projectiles
    const projectiles = game.add.group();
    projectiles.enableBody = true;
    projectiles.physicsBodyType = Phaser.Physics.ARCADE;
    projectiles.createMultiple( 40, 'mine' );
    projectiles.setAll( 'anchor.x', 0.5 );
    projectiles.setAll( 'anchor.y', 0.5 );
    this.projectiles = projectiles;

    // Input
    this.cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture( [ Phaser.Keyboard.SPACEBAR ] );

    // Debug lines
    this.radius = new Phaser.Line();
    this.velocity = new Phaser.Line();
    this.minAxis = new Phaser.Line();
    this.majAxis = new Phaser.Line();

    game.camera.follow( ship.sprite );
  }

  update() {
    const t = this.game.time.totalElapsedSeconds() * 1000;
    const ship = this.ship;
    const orbit = this.ship.orbit;

    const p = orbit.getPositionOfSecondary( t );
    ship.sprite.x = p.x;
    ship.sprite.y = p.y;
    ship.angle = ship.angle + ship.omega; // normalize( ship.angle + ship.omega );
    ship.sprite.rotation = ship.angle + Math.PI * 0.5;

    // Draw axis
    let p1 = orbit.getPointOnEllipse( 0 );
    let p2 = orbit.getPointOnEllipse( Math.PI );
    this.majAxis.fromPoints( p1, p2 );
    p1 = orbit.getPointOnEllipse( Math.PI / 2 );
    p2 = orbit.getPointOnEllipse( -Math.PI / 2 );
    this.minAxis.fromPoints( p1, p2 );

    this.projectiles.forEachExists( ( bomb ) => {
      if ( !bomb.orbit ) { bomb.kill(); }

      const p = bomb.orbit.getPositionOfSecondary( t );
      bomb.x = p.x;
      bomb.y = p.y;
    }, this );


    this.game.physics.arcade.overlap( this.ship.sprite, this.projectiles, this.collisionHandler, null, this );
    this.game.physics.arcade.overlap( this.planet, this.projectiles, this.collisionHandler, null, this );


    if ( this.cursors.left.isDown ) {
      ship.omega -= 0.0002908882; // 1 deg/sec @ 60fps (radians)
    } else if ( this.cursors.right.isDown ) {
      ship.omega += 0.0002908882; // 1 deg/sec @ 60fps (radians)
    }

    if ( this.cursors.up.isDown ) {
      this.boost( t );
    }
    if ( this.game.input.keyboard.isDown( Phaser.Keyboard.SPACEBAR ) ) {
      this.fireBomb();
    }
  }

  render() {
    // this.game.debug.cameraInfo(game.camera, 500, 32);
    // this.game.debug.spriteInfo(shipSprite, 32, 32);
    // this.game.debug.geom(radius);
    // this.game.debug.geom(velocity);
    this.game.debug.geom( this.minAxis );
    this.game.debug.geom( this.majAxis );

    // const t = this.game.time.totalElapsedSeconds() * 1000;
    const orbit = this.ship.orbit;
    const paths = this.paths;

    paths.clear();
    const period = orbit.getPeriod();
    const step = period / 100.0;

    let pos = orbit.getPositionOfSecondary( 0 );
    paths.moveTo( pos.x, pos.y );
    paths.lineStyle( 10, 0xFFFFFF, 0.25 );

    for ( let i = 1; i <= 100; i++ ) {
      pos = orbit.getPositionOfSecondary( step * i );
      paths.lineTo( pos.x, pos.y );
    }
  }

  boost( t ) {
    if ( this.boostTime && this.game.time.now <= this.boostTime ) { return; }
    this.boostTime = this.game.time.now + 50;
    console.log( 'Firing booster' );

    const orbit = this.ship.orbit;

    const r = orbit.getRadiusOfSecondary( t );
    const ra = orbit.getAngleToSecondary( t );
    const v = orbit.getVelocityOfSecondary( t );
    const va = orbit.getDirectionOfSecondary( t );

    const newV = Geometry.polarAdd( va, v, this.ship.angle, 0.0002 );

    console.log( 'old', v.toFixed(2), va.toFixed(2) );
    console.log( 'new', newV.magnitude.toFixed(2), newV.direction.toFixed(2) );

    // console.log('Replacing Orbit!:', V, newV.mag);
    this.ship.orbit = new Orbit( orbit.G, orbit.M, orbit.X, orbit.Y, r, ra, newV.magnitude, newV.direction, t );
  }

  fireBomb() {
    if ( this.fireTime && this.game.time.now <= this.fireTime ) { return; }
    this.fireTime = this.game.time.now + 1000;
    console.log( 'Firing bomb' );

    const ship = this.ship;

    const bomb = this.projectiles.getFirstExists( false );
    bomb.reset( ship.sprite.x, ship.sprite.y );
    bomb.rotation = ship.sprite.rotation;

    const t = this.game.time.totalElapsedSeconds() * 1000;
    const orbit = this.ship.orbit;

    const r = orbit.getRadiusOfSecondary( t );
    const ra = orbit.getAngleToSecondary( t );
    const v = orbit.getVelocityOfSecondary( t );
    const va = orbit.getDirectionOfSecondary( t );
    const newV = Geometry.polarAdd( va, v, ship.angle, 0.015 );

    bomb.orbit = new Orbit( orbit.G, orbit.M, orbit.X, orbit.Y, r, ra, newV.magnitude, newV.direction, t );
  }

  collisionHandler( ship, bomb ) { // eslint-disable-line no-unused-vars
    console.log( 'HIT!!!' );
  }
}

export default Level1State;