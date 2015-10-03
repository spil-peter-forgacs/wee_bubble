/**
 * The game engine.
 */

// SDK imports
import ui.View;

// User imports
import src.GameElements.Enemy as Enemy;
import src.GameElements.User as User;
import src.GameElements.HexaGrid as HexaGrid;

exports = Class(ui.View, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            x: 0,
            y: 0,
            width: 320,
            height: 480,
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function () {
        this._enemy = new Enemy();
        this._user = new User();
        this._hexagrid = new HexaGrid();

        this.addSubview( this._enemy );
        this.addSubview( this._user );
        this.addSubview( this._hexagrid );

        this.on('game1:start', start_game_flow.bind(this));
    };
});

/**
 * Game play.
 */
function start_game_flow () {
    var i = setInterval(tick.bind(this), 100);
}

/**
 * Game tick.
 */
function tick () {
}
