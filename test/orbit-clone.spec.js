/* global describe */
/* global before */
/* global beforeEach */
/* global it */
/* global after */
/* global afterEach */

require( 'should' );
const Orbit = require( '../lib/orbit' );


describe( 'Orbit Tests', () => {
    describe( '- Create Orbit from Orbit', () => {
        const SPEED = Math.sqrt( ( 0.1 * 10 ) / 300 ); // Speed for circular orbit
        const ORBIT = new Orbit( 0.1, 10, 0, 0, 300, Math.PI / 2, SPEED, 0.0 );
        const PERIOD = ORBIT.getPeriod();

        const ORBIT2 = new Orbit(
            ORBIT.G,
            ORBIT.M,
            ORBIT.X,
            ORBIT.Y,
            ORBIT.getRadiusOfSecondary( PERIOD * 0 ),
            ORBIT.getRadiusOfSecondary( PERIOD * 0 ),
            ORBIT.getVelocityOfSecondary( PERIOD * 0 ),
            ORBIT.getDirectionOfSecondary( PERIOD * 0 ),
            PERIOD * 0.3 );

        it( '- Orbits should follow equal positions', () => {
            ORBIT.getPositionOfSecondary( 0 ).should.equal( ORBIT2.getPositionOfSecondary( 0 ) );
        } );
    } );
} );
