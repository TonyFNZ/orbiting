class MenuState extends Phaser.State {
  create() {
    const game = this.game;
    const center = { x: this.game.world.centerX, y: this.game.world.centerY };

    this.logo = game.add.image(center.x, center.y - 100, 'logo-large');
    this.logo.anchor.set(0.5);

    let label = null;

    this.playBtn = game.add.button(center.x, center.y, 'btn', this.onPlayClick, this, 0, 1, 2, 1);
    this.playBtn.anchor.set(0.5);
    label = game.add.text(0, 0, 'Play', { font: '36px Arial', fill: '#000000', align: 'center', fontWeight: 'bold' });
    label.anchor.set(0.5);
    this.playBtn.addChild(label);

    this.instructionsBtn = game.add.button(center.x, center.y + 90, 'btn', this.onInstructionsClick, this, 0, 1, 2, 1);
    this.instructionsBtn.anchor.set(0.5);
    label = game.add.text(0, 0, 'Instructions', { font: '36px Arial', fill: '#000000', align: 'center', fontWeight: 'bold' });
    label.anchor.set(0.5);
    this.instructionsBtn.addChild(label);

    this.aboutBtn = game.add.button(center.x, center.y + 180, 'btn', this.onBtnClick, this, 0, 1, 2, 1);
    this.aboutBtn.anchor.set(0.5);
    label = game.add.text(0, 0, 'About', { font: '36px Arial', fill: '#000000', align: 'center', fontWeight: 'bold' });
    label.anchor.set(0.5);
    this.aboutBtn.addChild(label);
  }

  onPlayClick() {
    this.game.state.start('Level1');
  }

  onInstructionsClick() {
    console.log('INSTRUCTIONS');
  }

  onBtnClick() {
    console.log('ABOUT');
  }

}

export default MenuState;