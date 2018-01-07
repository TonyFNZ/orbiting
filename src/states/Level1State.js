/* eslint-disable no-console */
import Orbit from 'lib/Orbit';
import Spaceship from 'objects/Spaceship';
import Orbiter from 'objects/Orbiter';
import ModalPopover from 'objects/ModalPopover';


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

    const v = Math.sqrt( ( 0.1 * 10 ) / 300 ); // speed for circular orbit
    
    // Asteroid
    const orbit2 = new Orbit( 0.1, 10, 0, 0, 300, 0, v, -Math.PI*0.5 );
    const asteroid = new Orbiter(game, 0,0, 'asteroid-large-rock', 0, orbit2);
    asteroid.animations.add('spin').play(10, true);
    this.game.world.add(asteroid);
    this.asteroid = asteroid;


    // Spaceship
    const orbit = new Orbit( 0.1, 10, 0, 0, 300, Math.PI * 0.5, v, 0 );
    const spaceship = new Spaceship(game, 0, 300, 'ship', null, orbit);
    game.physics.enable( spaceship, Phaser.Physics.ARCADE );
    this.game.world.add(spaceship);
    this.spaceship = spaceship;

    const flames = game.add.group();
    flames.y = 15;
    const flame1 = game.add.sprite(-5, 0, 'thrust');
    flame1.animations.add('burn').play(10, true);
    const flame2 = game.add.sprite(0, 0, 'thrust');
    flame2.animations.add('burn').play(10, true);
    flames.add(flame1);
    flames.add(flame2);
    spaceship.addChild(flames);
    this.flames = flames;

    // Mines    
    const mines = game.add.group();
    for(let i=0; i<10; i++) {
      const mine = new Orbiter(game, 0, 0, 'mine', null, null);
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

    this.modal = new ModalPopover(this.game, 'Level 1', 'Capture the asteroid.\n\nRemember, sometimes to go faster, you need to slow down.', this.beginLevel.bind(this));
    this.game.world.add(this.modal);

    this.game.paused = true;
  }

  beginLevel() {
    this.modal.kill();
    this.game.paused = false;
    this.game.camera.follow( this.spaceship );
  }

  update() {
    this.time += this.game.time.physicsElapsedMS;

    this.spaceship.move(this.time);
    this.asteroid.move(this.time);

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
      this.flames.visible = true;
    } else {
      this.flames.visible = false;
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
    // this.game.debug.geom( this.minAxis );
    // this.game.debug.geom( this.majAxis );

    const paths = this.paths;

    paths.clear();

    paths.lineStyle( 2, 0xFFFFFF, 0.25 );
    this.spaceship.drawPath(paths, this.time);

    paths.lineStyle( 1, 0xFFFFFF, 0.25 );
    this.asteroid.drawPath(paths, this.time);

    this.mines.forEachExists( ( mine ) => {
      if ( !mine.orbit ) {
        // Should not exist without an orbit
        mine.alive = mine.exists = mine.visible = false;
      } else {
        mine.drawPath(paths, this.time);
      }
    }, this );
  }

  boost( time ) {
    if ( this.boostTime && this.game.time.now <= this.boostTime ) { return; }
    this.boostTime = this.game.time.now + 50;
    console.log( 'Firing booster' );

    this.spaceship.boost(time);
    //this.animation.play(10, false);
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