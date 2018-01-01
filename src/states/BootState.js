import RainbowText from 'objects/RainbowText';

class BootState extends Phaser.State {
  preload() {
    this.game.load.image( 'progressBar', 'assets/progressbar.png' );
  }

  create() {
    this.game.stage.backgroundColor = 0x000000;

    const center = { x: this.game.world.centerX, y: this.game.world.centerY };
    this.preloadBar = this.add.sprite(center.x - 65, center.y, 'progressBar');
    this.load.setPreloadSprite(this.preloadBar);

    const loadingText = new RainbowText(this.game, center.x, center.y + 30, 'Loading');
    loadingText.anchor.x = 0.5;
    this.game.loadingText = loadingText;

    this.game.state.start('LoadState');
  }
}

export default BootState;
