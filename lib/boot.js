var bootState = {
    preload() {
        game.load.image( 'progressBar', 'assets/progressBar.png' );
    },

    create() {
        game.stage.backgroundColor = '#3498db';
        game.physics.startSystem( Phaser.Physics.ARCADE );

        game.state.start( 'load' );
    }
};
