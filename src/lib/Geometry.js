const Geometry = {

  pointDistance( x, y ) {
    return Math.sqrt( x * x + y * y );
  },

  pointDirection( x, y ) {
    if ( x === 0 ) {
      if ( y > 0 ) {
        return Math.PI / 2;
      }
      if ( y < 0 ) {
        return -Math.PI / 2;
      }
    }

    return Math.atan2( y, x );
  },

  pointRotate( x, y, angle, originX = 0, originY = 0 ) {
    return {
      x: originX + Math.cos( angle ) * ( x - originX ) - Math.sin( angle ) * ( y - originY ),
      y: originY + Math.cos( angle ) * ( y - originY ) + Math.sin( angle ) * ( x - originX )
    };
  },

  pointMove( x, y, direction, distance ) {
    const newX = x + distance;
    return Geometry.pointRotate( newX, y, direction, x, y );
  },

  polarAdd( directionA, magnitudeA, directionB, magnitudeB ) {
    const x = Math.cos( directionA ) * magnitudeA + Math.cos( directionB ) * magnitudeB;
    const y = Math.sin( directionA ) * magnitudeA + Math.sin( directionB ) * magnitudeB;

    return {
      direction: Geometry.pointDirection( x, y ),
      magnitude: Geometry.pointDistance( x, y )
    };
  }
};

export default Geometry;
