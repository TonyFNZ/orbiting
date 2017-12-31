/* global describe */
/* global before */
/* global beforeEach */
/* global it */
/* global after */
/* global afterEach */

require( 'should' );
const Orbit = require( '../lib/orbit' );


describe( 'Orbit Tests', () => {
    describe( '- Basic Circular Orbits', () => {
        const SPEED = Math.sqrt( ( 0.1 * 10 ) / 300 ); // Speed for circular orbit
        const ORBIT = new Orbit( 0.1, 10, 0, 0, 300, Math.PI / 2, SPEED, 0.0 );
        const PERIOD = ORBIT.getPeriod();

        it( '- Should have constant speed', () => {
            throw new Error( 'Not yet implemented' );
        } );
    } );
} );
