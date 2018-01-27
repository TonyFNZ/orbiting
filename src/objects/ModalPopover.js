class ModalPopover extends Phaser.Group {
  constructor(game, title, text, callback) {
    super(game);

    this.callback = callback;
  
    this.curtain = game.add.graphics( 0, 0, this );
    
    this.background = game.add.image(0, 0, 'modal-bg', null, this);
    this.background.anchor.set(0.5);

    this.button = game.add.button(0,0,'btn-small', this.onBtnClick, this, 0, 1, 2, 1, this);
    this.button.alignIn(this.background, Phaser.BOTTOM_CENTER, 0, -10);
    const label = game.add.text(0, 0, 'OK', { font: '36px Arial', fill: '#000000', align: 'center', fontWeight: 'bold' }, this);
    label.alignIn(this.button, Phaser.CENTER);

    this.title = game.add.text(0, 0, title, { font: '36px Arial', fill: '#FFFFFF', fontWeight: 'bold' }, this);
    this.title.alignIn(this.background, Phaser.TOP_LEFT, -10, -10);

    this.text = game.add.text(0, 0, text, { font: '22px Arial', fill: '#FFFFFF', wordWrapWidth: 380, wordWrap: true }, this);
    this.text.alignIn(this.background, Phaser.TOP_LEFT, -10, -80);
  }
  
  setTitle(text) {
    this.title.text = text;
  }
  setText(text) {
    this.text.text = text;
  }

  update() {
    super.update();

    this.curtain.clear();
    this.curtain.beginFill(0x000000, 0.3);
    this.curtain.drawRect(0, 0, this.game.width, this.game.height);
    this.curtain.endFill();
  }

  onBtnClick() {
    if(this.callback) {
      this.callback();
    }
  }
}
  
export default ModalPopover;
  