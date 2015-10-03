/**
 * HexaGrid
 */

import ui.View;
import ui.ImageView as ImageView;

exports = Class(ui.View, function (supr) {
    this.init = function (opts) {

        this._config = JSON.parse(CACHE['resources/conf/config.json']);
        this._progress = 0;

        opts = merge(opts, {
            x: 0,
            y: this._config.enemySize,
            width: this._config.screenWidth,
            height: this._config.screenHeight - this._config.enemySize,
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function () {
        // Itaration variables.
        var i, j;

        // Load the balls.
        this._balls = [];
        for (i = 0; i < this._config.ballLength; i++) {
            this._balls[i] = 'resources/images/balls/ball' + i + '.png';
        }

        this.on('hexagrid:start', start_game_flow.bind(this));

        this.on('hexagrid:tick', tick.bind(this));
    };

    this.config = function (config) {
        this._config = config;
    };

    this.progress = function (progress) {
        this._progress = progress;
    };

});

/**
 * Game play.
 */
function start_game_flow () {
    // Create the hexagrid.
    this._hexagrid = [];
    for (i = 0; i < this._config.hexaGridHeight; i++) {
        this._hexagrid[i] = [];
        for (j = 0; j < this._config.hexaGridWidth; j++) {

            var ballImage = (
                i < this._config.hexaGridFilled ?
                this._balls[ Math.floor( Math.random() * this._config.ballLength) ] :
                this._config.ballEmpty
            );

            this._hexagrid[i][j] = new ImageView({
                superview: this,
                image: ballImage,
                width: this._config.ballSize,
                height: this._config.ballSize,
                x: (j * this._config.ballSize) + (i % 2) * (this._config.ballSize / 2),
                y: (i * this._config.ballSize)
            });
        }
    }

}

/**
 * Game tick.
 */
function tick () {
}
