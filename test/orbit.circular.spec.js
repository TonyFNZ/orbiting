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
        const T = ORBIT.getPeriod();

        it( '- Should have constant speed', () => {
            ORBIT.getVelocityOfSecondary( 0.00 * T ).should.be.approximately( SPEED, 0.001 );
            ORBIT.getVelocityOfSecondary( 0.25 * T ).should.be.approximately( SPEED, 0.001 );
            ORBIT.getVelocityOfSecondary( 0.50 * T ).should.be.approximately( SPEED, 0.001 );
            ORBIT.getVelocityOfSecondary( 0.75 * T ).should.be.approximately( SPEED, 0.001 );
            ORBIT.getVelocityOfSecondary( 1.00 * T ).should.be.approximately( SPEED, 0.001 );
        } );

        it( '- Should have constant radius', () => {
            ORBIT.getRadiusOfSecondary( 0.00 * T ).should.be.approximately( 300, 0.001 );
            ORBIT.getRadiusOfSecondary( 0.25 * T ).should.be.approximately( 300, 0.001 );
            ORBIT.getRadiusOfSecondary( 0.50 * T ).should.be.approximately( 300, 0.001 );
            ORBIT.getRadiusOfSecondary( 0.75 * T ).should.be.approximately( 300, 0.001 );
            ORBIT.getRadiusOfSecondary( 1.00 * T ).should.be.approximately( 300, 0.001 );
        } );

        it( '- Should move around primary at constant speed', () => {
            ORBIT.getAngleToSecondary( 0.00 * T ).should.be.approximately( 0.5 * Math.PI, 0.001 );
            ORBIT.getAngleToSecondary( 0.25 * T ).should.be.approximately( 0, 0.001 );
            ORBIT.getAngleToSecondary( 0.50 * T ).should.be.approximately( -0.5 * Math.PI, 0.001 );
            ORBIT.getAngleToSecondary( 0.75 * T ).should.be.approximately( Math.PI, 0.001 );
            ORBIT.getAngleToSecondary( 1.00 * T ).should.be.approximately( 0.5 * Math.PI, 0.001 );
        } );

        it( '- Should always have direction perpendicular to radius', () => {
            ORBIT.getDirectionOfSecondary( 0.00 * T ).should.be.approximately( 0, 0.001 );
            ORBIT.getDirectionOfSecondary( 0.25 * T ).should.be.approximately( -0.5 * Math.PI, 0.001 );
            ORBIT.getDirectionOfSecondary( 0.50 * T ).should.be.approximately( Math.PI, 0.001 );
            ORBIT.getDirectionOfSecondary( 0.75 * T ).should.be.approximately( 0.5 * Math.PI, 0.001 );
            ORBIT.getDirectionOfSecondary( 1.00 * T ).should.be.approximately( 0, 0.001 );
        } );

        it( '- Should move through correct positions', () => {
            ORBIT.getPositionOfSecondary( 0.00 * T ).x.should.be.approximately( 0, 0.001 );
            ORBIT.getPositionOfSecondary( 0.00 * T ).y.should.be.approximately( 300, 0.001 );

            ORBIT.getPositionOfSecondary( 0.25 * T ).x.should.be.approximately( 300, 0.001 );
            ORBIT.getPositionOfSecondary( 0.25 * T ).y.should.be.approximately( 0, 0.001 );

            ORBIT.getPositionOfSecondary( 0.50 * T ).x.should.be.approximately( 0, 0.001 );
            ORBIT.getPositionOfSecondary( 0.50 * T ).y.should.be.approximately( -300, 0.001 );

            ORBIT.getPositionOfSecondary( 0.75 * T ).x.should.be.approximately( -300, 0.001 );
            ORBIT.getPositionOfSecondary( 0.75 * T ).y.should.be.approximately( 0, 0.001 );

            ORBIT.getPositionOfSecondary( 1.00 * T ).x.should.be.approximately( 0, 0.001 );
            ORBIT.getPositionOfSecondary( 1.00 * T ).y.should.be.approximately( 300, 0.001 );
        } );
    } );

    describe( '- Off-center Primary', () => {
        const SPEED = Math.sqrt( ( 0.1 * 10 ) / 300 ); // Speed for circular orbit
        const ORBIT = new Orbit( 0.1, 10, 10, 10, 300, Math.PI / 2, SPEED, 0.0 );
        const T = ORBIT.getPeriod();

        it( '- Should have constant speed', () => {
            ORBIT.getVelocityOfSecondary( 0.00 * T ).should.be.approximately( SPEED, 0.001 );
            ORBIT.getVelocityOfSecondary( 0.25 * T ).should.be.approximately( SPEED, 0.001 );
            ORBIT.getVelocityOfSecondary( 0.50 * T ).should.be.approximately( SPEED, 0.001 );
            ORBIT.getVelocityOfSecondary( 0.75 * T ).should.be.approximately( SPEED, 0.001 );
            ORBIT.getVelocityOfSecondary( 1.00 * T ).should.be.approximately( SPEED, 0.001 );
        } );

        it( '- Should have constant radius', () => {
            ORBIT.getRadiusOfSecondary( 0.00 * T ).should.be.approximately( 300, 0.001 );
            ORBIT.getRadiusOfSecondary( 0.25 * T ).should.be.approximately( 300, 0.001 );
            ORBIT.getRadiusOfSecondary( 0.50 * T ).should.be.approximately( 300, 0.001 );
            ORBIT.getRadiusOfSecondary( 0.75 * T ).should.be.approximately( 300, 0.001 );
            ORBIT.getRadiusOfSecondary( 1.00 * T ).should.be.approximately( 300, 0.001 );
        } );

        it( '- Should move around primary at constant speed', () => {
            ORBIT.getAngleToSecondary( 0.00 * T ).should.be.approximately( 0.5 * Math.PI, 0.001 );
            ORBIT.getAngleToSecondary( 0.25 * T ).should.be.approximately( 0, 0.001 );
            ORBIT.getAngleToSecondary( 0.50 * T ).should.be.approximately( -0.5 * Math.PI, 0.001 );
            ORBIT.getAngleToSecondary( 0.75 * T ).should.be.approximately( Math.PI, 0.001 );
            ORBIT.getAngleToSecondary( 1.00 * T ).should.be.approximately( 0.5 * Math.PI, 0.001 );
        } );

        it( '- Should always have direction perpendicular to radius', () => {
            ORBIT.getDirectionOfSecondary( 0.00 * T ).should.be.approximately( 0, 0.001 );
            ORBIT.getDirectionOfSecondary( 0.25 * T ).should.be.approximately( -0.5 * Math.PI, 0.001 );
            ORBIT.getDirectionOfSecondary( 0.50 * T ).should.be.approximately( Math.PI, 0.001 );
            ORBIT.getDirectionOfSecondary( 0.75 * T ).should.be.approximately( 0.5 * Math.PI, 0.001 );
            ORBIT.getDirectionOfSecondary( 1.00 * T ).should.be.approximately( 0, 0.001 );
        } );

        it( '- Should move through correct positions', () => {
            ORBIT.getPositionOfSecondary( 0.00 * T ).x.should.be.approximately( 10, 0.001 );
            ORBIT.getPositionOfSecondary( 0.00 * T ).y.should.be.approximately( 310, 0.001 );

            ORBIT.getPositionOfSecondary( 0.25 * T ).x.should.be.approximately( 310, 0.001 );
            ORBIT.getPositionOfSecondary( 0.25 * T ).y.should.be.approximately( 10, 0.001 );

            ORBIT.getPositionOfSecondary( 0.50 * T ).x.should.be.approximately( 10, 0.001 );
            ORBIT.getPositionOfSecondary( 0.50 * T ).y.should.be.approximately( -290, 0.001 );

            ORBIT.getPositionOfSecondary( 0.75 * T ).x.should.be.approximately( -290, 0.001 );
            ORBIT.getPositionOfSecondary( 0.75 * T ).y.should.be.approximately( 10, 0.001 );

            ORBIT.getPositionOfSecondary( 1.00 * T ).x.should.be.approximately( 10, 0.001 );
            ORBIT.getPositionOfSecondary( 1.00 * T ).y.should.be.approximately( 310, 0.001 );
        } );
    } );
} );
