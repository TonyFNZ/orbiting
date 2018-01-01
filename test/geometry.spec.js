/* global describe */
/* global before */
/* global beforeEach */
/* global it */
/* global after */
/* global afterEach */

require( 'should' );
const geomUtil = require( '../lib/geometry' );


describe.only( 'Geometry Util Tests', () => {
    describe( '- Rotate Point', () => {
        it( '- Should correctly rotate point', () => {
            let point = geomUtil.pointRotate( 5, 0, Math.PI * 0.5 );
            point.x.should.be.approximately( 0, 1e-10 );
            point.y.should.be.approximately( 5, 1e-10 );

            point = geomUtil.pointRotate( 5, 0, Math.PI * 0.25 );
            point.x.should.be.approximately( 3.53553390593, 1e-10 );
            point.y.should.be.approximately( 3.53553390593, 1e-10 );
        } );

        it( '- Should correctly rotate point with custom origin', () => {
            let point = geomUtil.pointRotate( 5, 0, Math.PI * 0.5, 1, 2 );
            point.x.should.be.approximately( 3, 1e-10 );
            point.y.should.be.approximately( 6, 1e-10 );

            point = geomUtil.pointRotate( 5, 0, Math.PI * 0.25, 1, 2 );
            point.x.should.be.approximately( 5.24264068711, 1e-10 );
            point.y.should.be.approximately( 3.41421356237, 1e-10 );
        } );
    } );

    describe( '- Add Polar', () => {
        it( '- Should add values correctly 1', () => {
            const res = geomUtil.polarAdd( 0, 5, Math.PI / 2, 5 );
            res.direction.should.equal( Math.PI / 4 );
            res.magnitude.should.equal( 5 * Math.sqrt( 2 ) );
        } );

        it( '- Should add values correctly 2', () => {
            const res = geomUtil.polarAdd( -Math.PI / 4, 4, Math.PI / 4, 4 );
            res.direction.should.equal( 0 );
            res.magnitude.should.be.approximately( 8 / Math.sqrt( 2 ), 1e-10 );
        } );

        it( '- Should not add 0', () => {
            let res = geomUtil.polarAdd( -Math.PI / 4, 4, Math.PI / 4, 0 );
            res.direction.should.be.approximately( -Math.PI / 4, 1e-10 );
            res.magnitude.should.equal( 4 );

            res = geomUtil.polarAdd( -0.1 * Math.PI, 0.7, 0, 0 );
            res.direction.should.be.approximately( -0.1 * Math.PI, 1e-10 );
            res.magnitude.should.be.approximately( 0.7, 1e-10 );
        } );
    } );
} );

