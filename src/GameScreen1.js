/**
 * The game engine.
 */

// SDK imports
import ui.View;
import ui.ImageView as ImageView;

// User imports
import src.GameElements.Enemy as Enemy;
import src.GameElements.User as User;
import src.GameElements.HexaGrid as HexaGrid;

exports = Class(ui.View, function (supr) {
    this.init = function (opts) {

        this._config = JSON.parse(CACHE['resources/conf/config.json']);

        opts = merge(opts, {
            x: 0,
            y: 0,
            width: this._config.screenWidth,
            height: this._config.screenHeight,
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function () {

        this._input = false;

        // Background
        this._bg = new ImageView({
            superview: this,
            image: 'resources/images/bg2.jpg',
            width: this._config.screenWidth,
            height: this._config.screenHeight,
            x: 0,
            y: 0
        });

        this._user = new User();
        this._enemy = new Enemy();
        this._hexagrid = new HexaGrid();

        this.addSubview( this._user );
        this.addSubview( this._enemy );
        this.addSubview( this._hexagrid );

        this.on('game1:start', start_game_flow.bind(this));

        this.on('InputStart', function (event, point) {
            this._input = true;
            this._user.inputDown(point);
        });

        this.on('InputSelect', function (event, point) {
            this._input = false;
            this._user.inputUp(point);
        });

        this.on('InputMove', function (event, point) {
            if (this._input) {
                this._user.inputDown(point);
            }
        });
    };
});

/**
 * Game play.
 */
function start_game_flow () {
    // Game setup
    // Like:
    //this._enemy.style.r = 1;

    // Sub setup
    this._user.emit('user:start');
    this._enemy.emit('enemy:start');
    this._hexagrid.emit('hexagrid:start');

    var i = setInterval(tick.bind(this), 100);
}

/**
 * Game tick.
 */
function tick () {
    this._user.emit('user:tick');
    this._enemy.emit('enemy:tick');
    this._hexagrid.emit('hexagrid:tick');
}
