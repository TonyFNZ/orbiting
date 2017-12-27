// 'use strict';
// http://www.braeunig.us/space/orbmech.htm

/**
 * Ensure angle is between PI and -PI
 * @param {number} angle
 */
function normalize( angle ) {
    let value = angle;

    while ( value < -Math.PI ) {
        value += 2 * Math.PI;
    }

    while ( value > Math.PI ) {
        value -= 2 * Math.PI;
    }

    return value;
}


class Orbit {

    /**
     * Initialise an Elliptical orbit for the given initial conditions
     * Can be used later to calculate the position of the spaceship at a given time
     *
     * @param {number} G		The gravitational constant
     * @param {number} M		The mass of the primary body
     * @param {number} X		The X position of the primary body
     * @param {number} Y		The Y position of the primary body
     * @param {number} R		The initial distance between the bodies
     * @param {number} RA	The initial angle between the bodies (from the primary)
     * @param {number} V		The initial velocity of the secondary body
     * @param {number} VA	The initial direction of the secondary body (0 is right, PI/2 is up)
     * @param {number} T        Time when secondary entered this elipse
     */
    constructor( G, M, X, Y, R, RA, V, VA, T = 0 ) {
        // Primary Body
        this.GM = G * M;	        // Gravity and Mass (always multiplied in formulas)
        this.X = X;		        // X position of primary body
        this.Y = Y;		        // Y position of primary body

        // Secondary Body
        this.V0 = V;				// Linear velocity of this body
        this.VA0 = normalize( VA );	// Angle of velocity in radians (0 is right, PI/2 is up)
        this.R0 = R;				// Initial radius (distance from spaceship to primary)
        this.RA0 = normalize( RA );	// Angle of radius
        this.T0 = T;

        const gamma = normalize( VA - RA );   // Angle between velocity and position vectors
        this.DIR = ( gamma > 0 ) ? +1 : -1;    // +1 for clockwise, -1 for anti-clockwise

        /* Find Radiuses */
        let C = ( 2 * this.GM ) / ( R * V * V ); // Constant used in 4.25
        const p = 1 - C;   // Quadratic coefficients in 4.25
        const q = C;
        const r = -Math.sin( gamma ) * Math.sin( gamma );
        const radius1 = R * ( ( -q + Math.sqrt( q * q - 4 * p * r ) ) / ( 2 * p ) ); // Larger value is radius at periapsis
        const radius2 = R * ( ( -q - Math.sqrt( q * q - 4 * p * r ) ) / ( 2 * p ) ); // Smaller value is radius at apoapsis
        this.a = ( radius1 + radius2 ) / 2;
        console.log('a', this.a);

        /* Find True Anomaly (angle from primary to spaceship where axes are aligned on the ellipse) [equation 4.28]*/
        C = ( R * V * V ) / this.GM;	// Constant used in 4.28
        this.NU0 = Math.atan2( C * Math.sin( gamma ) * Math.cos( gamma ), C * Math.sin( gamma ) * Math.sin( gamma ) - 1 ); // Initial True anomaly

        /* Eccentricity */
        this.e = Math.sqrt( ( C - 1 ) * ( C - 1 ) * Math.sin( gamma ) * Math.sin( gamma ) + Math.cos( gamma ) * Math.cos( gamma ) ); // Eccentricity

        console.log('e',this.e);
        /* Other Anomalys */
        this.E0 = Math.atan2( Math.sqrt( 1 - this.e * this.e ) * Math.sin( this.NU0 ), this.e + Math.cos( this.NU0 ) );	// Initial eccentric anomaly
        this.M0 = this.E0 - this.e * Math.sin( this.E0 ); 										// Initial mean anomaly with 4.41

        /* Other Ellipse Properties */
        this.n = Math.sqrt( this.GM / ( this.a * this.a * this.a ) );		// Average angular velocity
        this.period = ( 2 * Math.PI / this.n );		// Period
    }


    /**
     * @returns {number} Period of the orbit
     */
    getPeriod() {
        return this.period;
    }

    getLength() {
        return this.a * 2;
    }

    getWidth() {
        return this.a * 2 * Math.sqrt(1-this.e*this.e);
    }


    /**
     * Get the angle of where the secondary body will be relative to the primary body at the specified time
     */
    getAngleToSecondary( time ) {
        const nu = this.getTrueAnomaly( time );

        // We need to do two adjustments to the angle - since we're doing everything relative to 'nu' we subtract that off,
        // then rotate everything by 'posangle' (the original angle to spaceship),
        // then we have actual position = r cos theta, r sin theta.
        const angle = nu - this.NU0 + this.RA0;
        return normalize( angle );
    }

    /**
     * Get the altitude (distance from the primary) of the secondary body
     */
    getAltitudeOfSecondary( time ) {
        const nu = this.getTrueAnomaly( time );
        const r = this.a * ( 1 - this.e * this.e ) / ( 1 + this.e * Math.cos( nu ) );
        return r;
    }


    /**
     * Get the direction of where the secondary body will be heading at the specified time
     */
    getDirectionOfSecondary( time ) {
        const nu = this.getTrueAnomaly( time );

        // 4.13  r1*v1*sin(g1) = r2*v2*sin(g2)
        const C = this.R0 * this.V0 * Math.sin( normalize( this.VA0 - this.RA0 ) );

        const r2 = this.a * ( 1 - this.e * this.e ) / ( 1 + this.e * Math.cos( nu ) );
        const v2 = Math.sqrt( this.GM * ( ( 2 / r2 ) - ( 1 / this.a ) ) );
        const g2 = Math.asin( C / ( r2 * v2 ) );
        // g2 is the angle between the position angle and the direction of flight

        // We need to do two adjustments to the angle - since we're doing everything relative to 'nu' we subtract that off,
        // then rotate everything by 'posangle' (the original angle to spaceship)
        // then we have actual position = r cos theta, r sin theta.
        const direction = g2 + nu - this.NU0 + this.RA0;
        return normalize( direction );
    }

    /**
     * Get the speed of the secondary at the specified time
     */
    getVelocityOfSecondary( time ) {
        const nu = this.getTrueAnomaly( time );
        const radius = this.a * ( 1 - this.e * this.e ) / ( 1 + this.e * Math.cos( nu ) );
        const speed = Math.sqrt( this.GM * ( ( 2 / radius ) - ( 1 / this.a ) ) );
        return speed;
    }

    /**
     * Get the point on the ellipse where the secondary body will be at the specified time
     */
    getPositionOfSecondary( time ) {
        const nu = this.getTrueAnomaly( time );
        const radius = this.a * ( 1 - this.e * this.e ) / ( 1 + this.e * Math.cos( nu ) ); // formula 4.43 gives us the distance from planet to spaceship given the true anomaly

        // We need to do two adjustments to the angle - since we're doing everything relative to 'nu' we subtract that off, then rotate everything by 'posangle' (the original angle to spaceship)
        // then we have actual position = r cos theta, r sin theta.
        const output = {};
        output.x = this.X + radius * Math.cos( nu - this.NU0 + this.RA0 );
        output.y = this.Y + radius * Math.sin( nu - this.NU0 + this.RA0 );
        return output;
    }

    getPointOnEllipse(angle) {
		const radius = this.a*(1-this.e*this.e)/(1+this.e*Math.cos(angle)); // formula 4.43 gives us the distance from planet to spaceship given the true anomaly
		// need to do two adjustments to the angle - since we're doing everything relative to 'nu' ew subtract that off, then rotate everything by 'posangle' (the original angle to spaceship)
		// then we have actual position = r cos theta, r sin theta.
		const output = {};
        output.x = radius*Math.cos(angle - this.NU0 + this.RA0);
		output.y = radius*Math.sin(angle - this.NU0 + this.RA0);
        return output;
	}


    getTrueAnomaly( time ) {
        let t = time - this.T0; // correct for time when the body entered the orbit
        t = t % this.period;

        /* Here I'm breaking away from the website a little bit, as its formula in 4.40 just uses cos,
        * and there are two solutions in a full period when doing inverse cos - this led to only half
        * of the orbit being calculated correctly. Instead, using the tan formula from
        * http://en.wikipedia.org/wiki/Eccentric_anomaly so that I can use atan2 */

        // Add on 'time' lots of n to the mean anomaly in 4.38
        const M = this.M0 + this.DIR * this.n * t;

        // Calculate what E value that correspond to by solving equation 4.41 in reverse. As mentioned there, this can't be done exactly, needs approximation methods
        const E = this.getEccentricAnomalyFromMeanAnomaly( M );

        // again, using a tan formula to calculate the true anomaly from the eccentric anomaly - again from wikipedia page for tan (theta/2),
        // though have split the right hand side up into sin / cos - found some other website that does the same thing, forget which
        const newnu = 2 * Math.atan2( Math.sqrt( 1 + this.e ) * Math.sin( E / 2 ), Math.sqrt( 1 - this.e ) * Math.cos( E / 2 ) );
        return normalize( newnu );
    }

    getEccentricAnomalyFromMeanAnomaly( M ) {
        // Approximation to solve for E when given M
        let ans = M;
        let count = 0;
        while ( count < 1000 ) {
            const newans = ans - ( ans - this.e * Math.sin( ans ) - M ) / ( 1 - this.e * Math.cos( ans ) );
            if ( Math.abs( ans - newans ) < 1e-9 ) {
                return newans;
            }
            ans = newans;

            count++;
        }

        return ans;
    }

}


if ( typeof module !== 'undefined' && typeof module.exports !== 'undefined' ) {
    module.exports = Orbit;
} else {
    window.Orbit = Orbit;
}

