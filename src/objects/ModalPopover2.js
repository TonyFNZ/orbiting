class ModalPopover extends Phaser.Group {
  constructor(game, title, text, callback) {
    super(game);

    this.callback = callback;
  
    this.curtain = game.add.graphics( 0, 0, this );

    const center = { x: this.game.world.centerX, y: this.game.world.centerY };
    
    this.bgTop = game.add.image(center.x-145, center.y-200, 'dialog-top', null, this);
    this.bgBottom = game.add.image(center.x-145, center.y+110, 'dialog-bottom', null, this);

    this.bgMiddle = game.add.tileSprite(center.x-145, center.y-150, 290, 260, 'dialog-middle');
    this.add(this.bgMiddle);
    
    //this.button = game.add.button(0,0,'btn-small', this.onBtnClick, this, 0, 1, 2, 1, this);
    //this.button.alignIn(this.bgBottom, Phaser.BOTTOM_CENTER, 0, -10);
    this.button = game.add.text(0, 0, 'OK', { font: '14px Arial', fill: '#FFFFFF', align: 'center', fontWeight: 'bold' }, this);
    this.button.alignIn(this.bgBottom, Phaser.BOTTOM_RIGHT, -45, -10);
    this.button.inputEnabled = true;
    this.button.events.onInputUp.add(this.onBtnClick, this);
    this.button.events.onInputOver.add(this.onBtnOver, this);
    this.button.events.onInputOut.add(this.onBtnOut, this);

    this.title = game.add.text(0, 0, title, { font: '22px Arial', fill: '#FFFFFF', fontWeight: 'bold' }, this);
    this.title.alignIn(this.bgTop, Phaser.TOP_LEFT, -30, -15);

    this.text = game.add.text(0, 0, text, { font: '14px Arial', fill: '#FFFFFF', wordWrapWidth: 230, wordWrap: true }, this);
    this.text.alignIn(this.bgMiddle, Phaser.TOP_LEFT, -30, -10);
  }

  setTitle(text) {
    this.title.text = text;
  }
  setText(text) {
    this.text.text = text;
  }
  
  update() {
    super.update();

    const bounds = this.game.camera;

    this.curtain.clear();
    this.curtain.beginFill(0x000000, 0.6);
    this.curtain.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
    this.curtain.endFill();
  }

  onBtnClick() {
    if(this.callback) {
      this.callback();
    }
  }

  onBtnOver() {
    this.button.fill = '#FFFF00';
  }

  onBtnOut() {
    this.button.fill = '#FFFFFF';
  }
}
  
export default ModalPopover;
  