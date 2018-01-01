var loadState = {

    preload() {
        game.load.image( 'planet', 'assets/water0.png' );
        game.load.image( 'ship', 'assets/aerie.png' );
        game.load.image( 'mine', 'assets/mine.png' );

        // TODO other assets go here
    },

    create() {
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

        game.state.start( 'level1' );
    }
};
