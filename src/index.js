import BootState from 'states/BootState';
import LoadState from 'states/LoadState';
import MenuState from 'states/MenuState';
import Level1State from 'states/Level1State';

class Game extends Phaser.Game {
  constructor() {
    super(800, 800, Phaser.AUTO, 'content', null);

    this.state.add('BootState', BootState);
    this.state.add('LoadState', LoadState);
    this.state.add('Menu', MenuState);
    this.state.add('Level1', Level1State);

    this.state.start('BootState');
  }
}

new Game();
