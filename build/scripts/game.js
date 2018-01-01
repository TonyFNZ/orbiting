(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _BootState = require('states/BootState');

var _BootState2 = _interopRequireDefault(_BootState);

var _LoadState = require('states/LoadState');

var _LoadState2 = _interopRequireDefault(_LoadState);

var _Level1State = require('states/Level1State');

var _Level1State2 = _interopRequireDefault(_Level1State);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Game = function (_Phaser$Game) {
  _inherits(Game, _Phaser$Game);

  function Game() {
    _classCallCheck(this, Game);

    var _this = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this, 800, 800, Phaser.AUTO, 'content', null));

    _this.state.add('BootState', _BootState2.default);
    _this.state.add('LoadState', _LoadState2.default);
    _this.state.add('Level1', _Level1State2.default);

    _this.state.start('BootState');
    return _this;
  }

  return Game;
}(Phaser.Game);

new Game();

},{"states/BootState":5,"states/Level1State":6,"states/LoadState":7}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Geometry = {
  pointDistance: function pointDistance(x, y) {
    return Math.sqrt(x * x + y * y);
  },
  pointDirection: function pointDirection(x, y) {
    if (x === 0) {
      if (y > 0) {
        return Math.PI / 2;
      }
      if (y < 0) {
        return -Math.PI / 2;
      }
    }

    return Math.atan2(y, x);
  },
  pointRotate: function pointRotate(x, y, angle) {
    var originX = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    var originY = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    return {
      x: originX + Math.cos(angle) * (x - originX) - Math.sin(angle) * (y - originY),
      y: originY + Math.cos(angle) * (y - originY) + Math.sin(angle) * (x - originX)
    };
  },
  pointMove: function pointMove(x, y, direction, distance) {
    var newX = x + distance;
    return Geometry.pointRotate(newX, y, direction, x, y);
  },
  polarAdd: function polarAdd(directionA, magnitudeA, directionB, magnitudeB) {
    var x = Math.cos(directionA) * magnitudeA + Math.cos(directionB) * magnitudeB;
    var y = Math.sin(directionA) * magnitudeA + Math.sin(directionB) * magnitudeB;

    return {
      direction: Geometry.pointDirection(x, y),
      magnitude: Geometry.pointDistance(x, y)
    };
  }
};

exports.default = Geometry;

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

// 'use strict';
// http://www.braeunig.us/space/orbmech.htm

/**
 * Ensure angle is between PI and -PI
 * @param {number} angle
 */
function normalize(angle) {
  var value = angle;

  while (value < -Math.PI) {
    value += 2 * Math.PI;
  }

  while (value > Math.PI) {
    value -= 2 * Math.PI;
  }

  return value;
}

var Orbit = function () {

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
  function Orbit(G, M, X, Y, R, RA, V, VA) {
    var T = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;

    _classCallCheck(this, Orbit);

    // Primary Body
    this.G = G;
    this.M = M;
    this.GM = G * M; // Gravity and Mass (always multiplied in formulas)
    this.X = X; // X position of primary body
    this.Y = Y; // Y position of primary body

    // Secondary Body
    this.V0 = V; // Linear velocity of this body
    this.VA0 = normalize(VA); // Angle of velocity in radians (0 is right, PI/2 is up)
    this.R0 = R; // Initial radius (distance from spaceship to primary)
    this.RA0 = normalize(RA); // Angle of radius
    this.T0 = T;

    var gamma = normalize(VA - RA); // Angle between velocity and position vectors
    this.DIR = gamma > 0 ? +1 : -1; // +1 for clockwise, -1 for anti-clockwise

    /* Find Radiuses */
    var C = 2 * this.GM / (R * V * V); // Constant used in 4.25
    var p = 1 - C; // Quadratic coefficients in 4.25
    var q = C;
    var r = -Math.sin(gamma) * Math.sin(gamma);
    var radius1 = R * ((-q + Math.sqrt(q * q - 4 * p * r)) / (2 * p)); // Larger value is radius at periapsis
    var radius2 = R * ((-q - Math.sqrt(q * q - 4 * p * r)) / (2 * p)); // Smaller value is radius at apoapsis
    this.a = (radius1 + radius2) / 2;
    // console.log( 'a', this.a );

    /* Find True Anomaly (angle from primary to spaceship where axes are aligned on the ellipse) [equation 4.28]*/
    C = R * V * V / this.GM; // Constant used in 4.28
    this.NU0 = Math.atan2(C * Math.sin(gamma) * Math.cos(gamma), C * Math.sin(gamma) * Math.sin(gamma) - 1); // Initial True anomaly

    /* Eccentricity */
    this.e = Math.sqrt((C - 1) * (C - 1) * Math.sin(gamma) * Math.sin(gamma) + Math.cos(gamma) * Math.cos(gamma)); // Eccentricity

    // console.log( 'e', this.e );
    /* Other Anomalys */
    this.E0 = Math.atan2(Math.sqrt(1 - this.e * this.e) * Math.sin(this.NU0), this.e + Math.cos(this.NU0)); // Initial eccentric anomaly
    this.M0 = this.E0 - this.e * Math.sin(this.E0); // Initial mean anomaly with 4.41

    /* Other Ellipse Properties */
    this.n = Math.sqrt(this.GM / (this.a * this.a * this.a)); // Average angular velocity
    this.period = 2 * Math.PI / this.n; // Period
  }

  /**
     * @returns {number} Period of the orbit
     */

  _createClass(Orbit, [{
    key: 'getPeriod',
    value: function getPeriod() {
      return this.period;
    }
  }, {
    key: 'getLength',
    value: function getLength() {
      return this.a * 2;
    }
  }, {
    key: 'getWidth',
    value: function getWidth() {
      return this.a * 2 * Math.sqrt(1 - this.e * this.e);
    }

    /**
       * Get the angle of where the secondary body will be relative to the primary body at the specified time
       */

  }, {
    key: 'getAngleToSecondary',
    value: function getAngleToSecondary(time) {
      var nu = this.getTrueAnomaly(time);

      // We need to do two adjustments to the angle - since we're doing everything relative to 'nu' we subtract that off,
      // then rotate everything by 'posangle' (the original angle to spaceship),
      // then we have actual position = r cos theta, r sin theta.
      var angle = nu - this.NU0 + this.RA0;
      return normalize(angle);
    }

    /**
       * Get the altitude (distance from the primary) of the secondary body
       */

  }, {
    key: 'getRadiusOfSecondary',
    value: function getRadiusOfSecondary(time) {
      var nu = this.getTrueAnomaly(time);
      var r = this.a * (1 - this.e * this.e) / (1 + this.e * Math.cos(nu));
      return r;
    }

    /**
       * Get the direction of where the secondary body will be heading at the specified time
       */

  }, {
    key: 'getDirectionOfSecondary',
    value: function getDirectionOfSecondary(time) {
      var nu = this.getTrueAnomaly(time);

      // 4.13  r1*v1*sin(g1) = r2*v2*sin(g2)
      // g2 is the angle between the position angle and the direction of flight
      var C = this.R0 * this.V0 * Math.sin(normalize(this.VA0 - this.RA0));

      var r2 = this.getRadiusOfSecondary(time);
      var v2 = this.getVelocityOfSecondary(time);

      var val = C / (r2 * v2);
      // Avoid occasional double rounding error that puts value slightly outside allowed range
      val = Math.min(val, 1);
      val = Math.max(val, -1);
      var g2 = Math.asin(val);

      if (nu > 0) {
        // Spaceship is returning, so g2 is on other side
        g2 = -Math.PI - g2;
      }

      // We need to do two adjustments to the angle - since we're doing everything relative to 'nu' we subtract that off,
      // then rotate everything by NU0 (the original angle to spaceship)
      var direction = g2 + nu - this.NU0 + this.RA0;
      return normalize(direction);
    }

    /**
       * Get the speed of the secondary at the specified time
       */

  }, {
    key: 'getVelocityOfSecondary',
    value: function getVelocityOfSecondary(time) {
      var nu = this.getTrueAnomaly(time);
      var r = this.a * (1 - this.e * this.e) / (1 + this.e * Math.cos(nu));
      var speed = Math.sqrt(this.GM * (2 / r - 1 / this.a));
      return speed;
    }

    /**
       * Get the point on the ellipse where the secondary body will be at the specified time
       */

  }, {
    key: 'getPositionOfSecondary',
    value: function getPositionOfSecondary(time) {
      var nu = this.getTrueAnomaly(time);
      var radius = this.a * (1 - this.e * this.e) / (1 + this.e * Math.cos(nu)); // formula 4.43 gives us the distance from planet to spaceship given the true anomaly

      // We need to do two adjustments to the angle - since we're doing everything relative to 'nu' we subtract that off, then rotate everything by 'posangle' (the original angle to spaceship)
      // then we have actual position = r cos theta, r sin theta.
      return {
        x: this.X + radius * Math.cos(nu - this.NU0 + this.RA0),
        y: this.Y + radius * Math.sin(nu - this.NU0 + this.RA0)
      };
    }
  }, {
    key: 'getPointOnEllipse',
    value: function getPointOnEllipse(angle) {
      var radius = this.a * (1 - this.e * this.e) / (1 + this.e * Math.cos(angle)); // formula 4.43 gives us the distance from planet to spaceship given the true anomaly

      // need to do two adjustments to the angle - since we're doing everything relative to 'nu' ew subtract that off, then rotate everything by 'posangle' (the original angle to spaceship)
      // then we have actual position = r cos theta, r sin theta.
      return {
        x: radius * Math.cos(angle - this.NU0 + this.RA0),
        y: radius * Math.sin(angle - this.NU0 + this.RA0)
      };
    }
  }, {
    key: 'getTrueAnomaly',
    value: function getTrueAnomaly(time) {
      var t = time - this.T0; // correct for time when the body entered the orbit
      t = t % this.period;

      /* Here I'm breaking away from the website a little bit, as its formula in 4.40 just uses cos,
          * and there are two solutions in a full period when doing inverse cos - this led to only half
          * of the orbit being calculated correctly. Instead, using the tan formula from
          * http://en.wikipedia.org/wiki/Eccentric_anomaly so that I can use atan2 */

      // Add on 'time' lots of n to the mean anomaly in 4.38
      var M = this.M0 + this.DIR * this.n * t;

      // Calculate what E value that correspond to by solving equation 4.41 in reverse. As mentioned there, this can't be done exactly, needs approximation methods
      var E = this.getEccentricAnomalyFromMeanAnomaly(M);

      // again, using a tan formula to calculate the true anomaly from the eccentric anomaly - again from wikipedia page for tan (theta/2),
      // though have split the right hand side up into sin / cos - found some other website that does the same thing, forget which
      var newnu = 2 * Math.atan2(Math.sqrt(1 + this.e) * Math.sin(E / 2), Math.sqrt(1 - this.e) * Math.cos(E / 2));
      return normalize(newnu);
    }
  }, {
    key: 'getEccentricAnomalyFromMeanAnomaly',
    value: function getEccentricAnomalyFromMeanAnomaly(M) {
      // Approximation to solve for E when given M
      var ans = M;
      var count = 0;
      while (count < 1000) {
        var newans = ans - (ans - this.e * Math.sin(ans) - M) / (1 - this.e * Math.cos(ans));
        if (Math.abs(ans - newans) < 1e-9) {
          return newans;
        }
        ans = newans;

        count++;
      }

      return ans;
    }
  }]);

  return Orbit;
}();

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = Orbit;
}

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var RainbowText = function (_Phaser$Text) {
  _inherits(RainbowText, _Phaser$Text);

  function RainbowText(game, x, y, text) {
    _classCallCheck(this, RainbowText);

    var _this = _possibleConstructorReturn(this, (RainbowText.__proto__ || Object.getPrototypeOf(RainbowText)).call(this, game, x, y, text, { font: '24px Arial', fill: '#ff0044', align: 'center' }));

    _this._speed = 125; // ms
    _this._colorIndex = 0;
    _this._colors = ['#ee4035', '#f37736', '#fdf498', '#7bc043', '#0392cf'];

    _this.colorize();
    _this.startTimer();

    _this.game.stage.addChild(_this);
    return _this;
  }

  _createClass(RainbowText, [{
    key: 'startTimer',
    value: function startTimer() {
      this.game.time.events.loop(this._speed, this.colorize, this).timer.start();
    }
  }, {
    key: 'colorize',
    value: function colorize() {
      for (var i = 0; i < this.text.length; i++) {
        if (this._colorIndex === this._colors.length) {
          this._colorIndex = 0;
        }

        this.addColor(this._colors[this._colorIndex], i);
        this._colorIndex++;
      }
    }
  }, {
    key: 'remove',
    value: function remove() {
      this.game.stage.removeChild(this);
    }
  }]);

  return RainbowText;
}(Phaser.Text);

exports.default = RainbowText;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _RainbowText = require('objects/RainbowText');

var _RainbowText2 = _interopRequireDefault(_RainbowText);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var BootState = function (_Phaser$State) {
  _inherits(BootState, _Phaser$State);

  function BootState() {
    _classCallCheck(this, BootState);

    return _possibleConstructorReturn(this, (BootState.__proto__ || Object.getPrototypeOf(BootState)).apply(this, arguments));
  }

  _createClass(BootState, [{
    key: 'preload',
    value: function preload() {
      this.game.load.image('progressBar', 'assets/progressbar.png');
    }
  }, {
    key: 'create',
    value: function create() {
      this.game.stage.backgroundColor = 0x000000;

      var center = { x: this.game.world.centerX, y: this.game.world.centerY };
      this.preloadBar = this.add.sprite(center.x - 65, center.y, 'progressBar');
      this.load.setPreloadSprite(this.preloadBar);

      var loadingText = new _RainbowText2.default(this.game, center.x, center.y + 30, 'Loading');
      loadingText.anchor.x = 0.5;
      this.game.loadingText = loadingText;

      this.game.state.start('LoadState');
    }
  }]);

  return BootState;
}(Phaser.State);

exports.default = BootState;

},{"objects/RainbowText":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _Orbit = require('lib/Orbit');

var _Orbit2 = _interopRequireDefault(_Orbit);

var _Geometry = require('lib/Geometry');

var _Geometry2 = _interopRequireDefault(_Geometry);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
} /* eslint-disable no-console */

var Level1State = function (_Phaser$State) {
  _inherits(Level1State, _Phaser$State);

  function Level1State() {
    _classCallCheck(this, Level1State);

    return _possibleConstructorReturn(this, (Level1State.__proto__ || Object.getPrototypeOf(Level1State)).apply(this, arguments));
  }

  _createClass(Level1State, [{
    key: 'create',
    value: function create() {
      var game = this.game;

      game.stage.backgroundColor = '#000000';
      game.world.setBounds(-2000, -2000, 4000, 4000);

      game.physics.startSystem(Phaser.Physics.ARCADE);

      // Drawing surface for orbit paths
      this.paths = game.add.graphics(0, 0);

      // Planet
      var planet = game.add.sprite(0, 0, 'planet');
      planet.anchor.set(0.5);
      planet.scale.set(2);
      planet.enableBody = true;
      game.physics.enable(planet, Phaser.Physics.ARCADE);
      this.planet = planet;

      // Ship
      var ship = {
        angle: 0,
        omega: 0,
        sprite: null,
        orbit: null
      };
      ship.sprite = game.add.sprite(0, 300, 'ship');
      ship.sprite.anchor.set(0.5);
      //ship.sprite.scale.set( 0.5 );
      ship.sprite.enableBody = true;
      game.physics.enable(ship.sprite, Phaser.Physics.ARCADE);
      var v = Math.sqrt(0.1 * 10 / 300);
      ship.orbit = new _Orbit2.default(0.1, 10, 0, 0, 300, Math.PI * 0.5, v, 0);
      this.ship = ship;

      // Mines/Projectiles
      var projectiles = game.add.group();
      projectiles.enableBody = true;
      projectiles.physicsBodyType = Phaser.Physics.ARCADE;
      projectiles.createMultiple(40, 'mine');
      projectiles.setAll('anchor.x', 0.5);
      projectiles.setAll('anchor.y', 0.5);
      this.projectiles = projectiles;

      // Input
      this.cursors = game.input.keyboard.createCursorKeys();
      game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

      // Debug lines
      this.radius = new Phaser.Line();
      this.velocity = new Phaser.Line();
      this.minAxis = new Phaser.Line();
      this.majAxis = new Phaser.Line();

      game.camera.follow(ship.sprite);
    }
  }, {
    key: 'update',
    value: function update() {
      var t = this.game.time.totalElapsedSeconds() * 1000;
      var ship = this.ship;
      var orbit = this.ship.orbit;

      var p = orbit.getPositionOfSecondary(t);
      ship.sprite.x = p.x;
      ship.sprite.y = p.y;
      ship.angle = ship.angle + ship.omega; // normalize( ship.angle + ship.omega );
      ship.sprite.rotation = ship.angle + Math.PI * 0.5;

      // Draw axis
      var p1 = orbit.getPointOnEllipse(0);
      var p2 = orbit.getPointOnEllipse(Math.PI);
      this.majAxis.fromPoints(p1, p2);
      p1 = orbit.getPointOnEllipse(Math.PI / 2);
      p2 = orbit.getPointOnEllipse(-Math.PI / 2);
      this.minAxis.fromPoints(p1, p2);

      this.projectiles.forEachExists(function (bomb) {
        if (!bomb.orbit) {
          bomb.kill();
        }

        var p = bomb.orbit.getPositionOfSecondary(t);
        bomb.x = p.x;
        bomb.y = p.y;
      }, this);

      this.game.physics.arcade.overlap(this.ship.sprite, this.projectiles, this.collisionHandler, null, this);
      this.game.physics.arcade.overlap(this.planet, this.projectiles, this.collisionHandler, null, this);

      if (this.cursors.left.isDown) {
        ship.omega -= 0.0002908882; // 1 deg/sec @ 60fps (radians)
      } else if (this.cursors.right.isDown) {
        ship.omega += 0.0002908882; // 1 deg/sec @ 60fps (radians)
      }

      if (this.cursors.up.isDown) {
        this.boost(t);
      }
      if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        this.fireBomb();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      // this.game.debug.cameraInfo(game.camera, 500, 32);
      // this.game.debug.spriteInfo(shipSprite, 32, 32);
      // this.game.debug.geom(radius);
      // this.game.debug.geom(velocity);
      this.game.debug.geom(this.minAxis);
      this.game.debug.geom(this.majAxis);

      // const t = this.game.time.totalElapsedSeconds() * 1000;
      var orbit = this.ship.orbit;
      var paths = this.paths;

      paths.clear();
      var period = orbit.getPeriod();
      var step = period / 100.0;

      var pos = orbit.getPositionOfSecondary(0);
      paths.moveTo(pos.x, pos.y);
      paths.lineStyle(10, 0xFFFFFF, 0.25);

      for (var i = 1; i <= 100; i++) {
        pos = orbit.getPositionOfSecondary(step * i);
        paths.lineTo(pos.x, pos.y);
      }
    }
  }, {
    key: 'boost',
    value: function boost(t) {
      if (this.boostTime && this.game.time.now <= this.boostTime) {
        return;
      }
      this.boostTime = this.game.time.now + 50;
      console.log('Firing booster');

      var orbit = this.ship.orbit;

      var r = orbit.getRadiusOfSecondary(t);
      var ra = orbit.getAngleToSecondary(t);
      var v = orbit.getVelocityOfSecondary(t);
      var va = orbit.getDirectionOfSecondary(t);

      var newV = _Geometry2.default.polarAdd(va, v, this.ship.angle, 0.0002);

      console.log('old', v.toFixed(2), va.toFixed(2));
      console.log('new', newV.magnitude.toFixed(2), newV.direction.toFixed(2));

      // console.log('Replacing Orbit!:', V, newV.mag);
      this.ship.orbit = new _Orbit2.default(orbit.G, orbit.M, orbit.X, orbit.Y, r, ra, newV.magnitude, newV.direction, t);
    }
  }, {
    key: 'fireBomb',
    value: function fireBomb() {
      if (this.fireTime && this.game.time.now <= this.fireTime) {
        return;
      }
      this.fireTime = this.game.time.now + 1000;
      console.log('Firing bomb');

      var ship = this.ship;

      var bomb = this.projectiles.getFirstExists(false);
      bomb.reset(ship.sprite.x, ship.sprite.y);
      bomb.rotation = ship.sprite.rotation;

      var t = this.game.time.totalElapsedSeconds() * 1000;
      var orbit = this.ship.orbit;

      var r = orbit.getRadiusOfSecondary(t);
      var ra = orbit.getAngleToSecondary(t);
      var v = orbit.getVelocityOfSecondary(t);
      var va = orbit.getDirectionOfSecondary(t);
      var newV = _Geometry2.default.polarAdd(va, v, ship.angle, 0.015);

      bomb.orbit = new _Orbit2.default(orbit.G, orbit.M, orbit.X, orbit.Y, r, ra, newV.magnitude, newV.direction, t);
    }
  }, {
    key: 'collisionHandler',
    value: function collisionHandler(ship, bomb) {
      // eslint-disable-line no-unused-vars
      console.log('HIT!!!');
    }
  }]);

  return Level1State;
}(Phaser.State);

exports.default = Level1State;

},{"lib/Geometry":2,"lib/Orbit":3}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var LoadState = function (_Phaser$State) {
  _inherits(LoadState, _Phaser$State);

  function LoadState() {
    _classCallCheck(this, LoadState);

    return _possibleConstructorReturn(this, (LoadState.__proto__ || Object.getPrototypeOf(LoadState)).apply(this, arguments));
  }

  _createClass(LoadState, [{
    key: 'preload',
    value: function preload() {
      var load = this.game.load;
      load.image('planet', 'assets/planet-water.png');
      load.image('ship', 'assets/ship.png');
      load.image('mine', 'assets/mine.png');

      // TODO other assets go here
    }
  }, {
    key: 'create',
    value: function create() {
      var game = this.game;

      if (!game.device.desktop) {
        // Mobile device support
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        document.body.style.backgroundColor = '#3498db';

        game.scale.minWidth = 250;
        game.scale.minHeight = 170;
        game.scale.maxWidth = 1000;
        game.scale.maxHeight = 680;

        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

        game.scale.setScreenSize(true);
      }

      this.game.state.start('Level1');
    }
  }, {
    key: 'shutdown',
    value: function shutdown() {
      this.game.loadingText.remove();
    }
  }]);

  return LoadState;
}(Phaser.State);

exports.default = LoadState;

},{}]},{},[1])
//# sourceMappingURL=game.js.map
