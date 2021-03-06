import RainbowText from 'objects/RainbowText';

class TestState extends Phaser.State {
  create() {
    const center = { x: this.game.world.centerX, y: this.game.world.centerY };
    const text = new RainbowText(this.game, center.x, center.y, '- phaser -\nwith a sprinkle of\nES6 dust!');
    text.anchor.set(0.5);
  }
}

export default TestState;
