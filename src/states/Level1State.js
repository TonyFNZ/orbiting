/* eslint-disable no-console */
import Orbit from 'lib/Orbit';
import Spaceship from 'objects/Spaceship';


class Level1State extends Phaser.State {

  create() {
    const game = this.game;

    // Keep track of game time
    this.time = 0;

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

    // Spaceship
    const v = Math.sqrt( ( 0.1 * 10 ) / 300 );
    const orbit = new Orbit( 0.1, 10, 0, 0, 300, Math.PI * 0.5, v, 0 );
    const spaceship = new Spaceship(game, 0, 300, 'ship', null, orbit);
    game.physics.enable( spaceship, Phaser.Physics.ARCADE );
    this.game.world.add(spaceship);
    this.spaceship = spaceship;


    const flames = game.add.sprite(-20,0, 'thrust');
    this.animation = flames.animations.add('burn');
    this.animation.play(10);
    this.animation.setFrame(7);
    spaceship.addChild(flames);


    // Mines    
    const mines = game.add.group();
    for(let i=0; i<10; i++) {
      const mine = new Spaceship(game, 0, 0, 'mine', null, null);
      mine.alive = mine.exists = mine.visible = false;
      mines.add(mine);
    }
    this.mines = mines;


    // Input
    this.cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture( [ Phaser.Keyboard.SPACEBAR ] );

    // Debug lines
    this.radius = new Phaser.Line();
    this.velocity = new Phaser.Line();
    this.minAxis = new Phaser.Line();
    this.majAxis = new Phaser.Line();

    game.camera.follow( spaceship );
  }

  update() {
    this.time += this.game.time.physicsElapsedMS;

    this.spaceship.move(this.time);

    const orbit = this.spaceship.orbit;

    // Axis lines (debug)
    let p1 = orbit.getPointOnEllipse( 0 );
    let p2 = orbit.getPointOnEllipse( Math.PI );
    this.majAxis.fromPoints( p1, p2 );
    p1 = orbit.getPointOnEllipse( Math.PI / 2 );
    p2 = orbit.getPointOnEllipse( -Math.PI / 2 );
    this.minAxis.fromPoints( p1, p2 );


    this.mines.forEachExists( ( mine ) => {
      if ( !mine.orbit ) {
        // Should not exist without an orbit
        mine.alive = mine.exists = mine.visible = false;
      } else {
        mine.move(this.time);
      }
    }, this );


    this.game.physics.arcade.overlap( this.spaceship, this.projectiles, this.collisionHandler, null, this );
    //this.game.physics.arcade.overlap( this.planet, this.projectiles, this.collisionHandler, null, this );


    if ( this.cursors.left.isDown ) {
      this.spaceship.turn(-1);
    }
    if ( this.cursors.right.isDown ) {
      this.spaceship.turn(+1);
    }
    if ( this.cursors.up.isDown ) {
      this.boost( this.time );
    }
    if ( this.game.input.keyboard.isDown( Phaser.Keyboard.SPACEBAR ) ) {
      this.fire( this.time );
    }
  }

  render() {
    // this.game.debug.cameraInfo(this.game.camera, 500, 32);
    // this.game.debug.spriteInfo(this.spaceship, 32, 32);
    // this.game.debug.geom(radius);
    // this.game.debug.geom(velocity);
    this.game.debug.geom( this.minAxis );
    this.game.debug.geom( this.majAxis );

    // const t = this.game.time.totalElapsedSeconds() * 1000;
    const orbit = this.spaceship.orbit;
    const paths = this.paths;

    paths.clear();
    
    let pos = orbit.getPointOnEllipse( 0 );
    paths.moveTo( pos.x, pos.y );
    paths.lineStyle( 10, 0xFFFFFF, 0.25 );
    
    const step = Math.PI / 50;
    for ( let i = 1; i <= 100; i++ ) {
      pos = orbit.getPointOnEllipse( step * i );
      paths.lineTo( pos.x, pos.y );
    }
  }

  boost( time ) {
    if ( this.boostTime && this.game.time.now <= this.boostTime ) { return; }
    this.boostTime = this.game.time.now + 50;
    console.log( 'Firing booster' );

    this.spaceship.boost(time);
    this.animation.play(10, false);
  }

  fire(time) {
    if ( this.fireTime && this.game.time.now <= this.fireTime ) { return; }
    this.fireTime = this.game.time.now + 1000;
    console.log( 'Firing bomb' );

    const mine = this.mines.getFirstExists( false );
    this.spaceship.flingMine(time, mine);
  }

  collisionHandler( ship, bomb ) { // eslint-disable-line no-unused-vars
    console.log( 'HIT!!!' );
  }
}

export default Level1State;