class LoadState extends Phaser.State {
  preload() {
    const load = this.game.load;
    load.image( 'planet', 'assets/planet-water.png' );
    load.image( 'ship', 'assets/ship.png' );
    load.image( 'mine', 'assets/mine.png' );
    load.spritesheet( 'thrust', 'assets/thrust.png', 40, 50 );

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
  
    this.game.state.start('Level1');
  }

  shutdown() {
    this.game.loadingText.remove();
  }
}

export default LoadState;