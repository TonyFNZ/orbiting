// Converts from degrees to radians.
Math.radians = function ( degrees ) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function ( radians ) {
    return radians * 180 / Math.PI;
};


function distanceFromPoint( x, y ) {
    return Math.sqrt( x * x + y * y );
}

function directionFromPoint( x, y ) {
    if ( x === 0 ) {
        if ( y > 0 ) {
            return Math.PI / 2;
        }
        if ( y < 0 ) {
            return -Math.PI / 2;
        }
    }

    return Math.atan2( y, x );
}

function polarAdd( dir1, mag1, dir2, mag2 ) {
    let dx = Math.cos( dir1 ) * mag1;
    let dy = Math.sin( dir1 ) * mag1;

    dx += Math.cos( dir2 ) * mag2;
    dy += Math.sin( dir2 ) * mag2;

    return {
        dir: directionFromPoint( dx, dy ),
        mag: distanceFromPoint( dx, dy )
    };
}

function rotatePoint( x, y, angle, origX = 0, origY = 0 ) {
    // Must calculate values before assigning back to this object otherwise the second calculation
    // is changed by the result of the first one
    const px = origX + Math.cos( angle ) * ( x - origX ) - Math.sin( angle ) * ( y - origY );
    const py = origY + Math.cos( angle ) * ( y - origY ) + Math.sin( angle ) * ( x - origX );

    return {
        x: px,
        y: py
    };
}

function movePoint( x, y, direction, magnitude ) {
    // Lazy solution using rotate function above
    // Avoids having to figure out all the sin and cos combinations again :)

    const newX = x + magnitude;
    return rotatePoint( newX, y, direction, x, y );
}


if ( typeof module !== 'undefined' && typeof module.exports !== 'undefined' ) {
    module.exports = {
        distanceFromPoint,
        directionFromPoint,
        polarAdd,
        rotatePoint,
        movePoint
    };
}
