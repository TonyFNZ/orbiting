class LoadState extends Phaser.State {
  preload() {
    const load = this.game.load;
    load.image( 'planet', 'assets/planet-water.png' );
    load.image( 'ship', 'assets/ship.png' );
    load.image( 'mine', 'assets/mine.png' );
    load.spritesheet( 'thrust', 'assets/thruster-tiny.png', 5, 20 );

    load.spritesheet( 'asteroid-large-rock', 'assets/asteroid-large-rock.png', 100, 100 );

    load.image( 'logo-large', 'assets/logo-large.png' );
    load.spritesheet( 'btn', 'assets/btn.png', 300, 66 );
    load.spritesheet( 'btn-small', 'assets/btn-small.png', 100, 66 );
    load.spritesheet( 'btn-square', 'assets/btn-square.png', 66, 66 );
    load.image( 'modal-bg', 'assets/modal-bg.png' );


    // TODO other assets go here
  }

  create() {
    const game = this.game;

    if ( !game.device.desktop ) {
      // Mobile device support
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

      document.body.style.backgroundColor = '#3498db';

      game.scale.minWidth = 250;
      game.scale.minHeight = 170;
      game.scale.maxWidth = 1000;
      game.scale.maxHeight = 680;

      game.scale.pageAlignHorizontally = true;
      game.scale.pageAlignVertically = true;

      game.scale.setScreenSize( true );
    }
  
    // this.game.state.start('Level1');
    this.game.state.start('Menu');
    
  }

  shutdown() {
    this.game.loadingText.remove();
  }
}

export default LoadState;