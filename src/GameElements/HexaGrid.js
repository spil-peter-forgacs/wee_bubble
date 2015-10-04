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
        // Load the balls.
        this._balls = [];
        for (var i = 0; i < this._config.ballLength; i++) {
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

    /**
     * Get ball src from id
     *
     * @param int id
     *
     * @return string ballSrc
     */
    this.getBallSrc = function ( id ) {
        var ballSrc = this._config.ballEmpty;

        if (id !== null) {
            ballSrc = this._balls[ id ];
        }

        return ballSrc;
    }

    /**
     * Check, if the fired ball hit hexagrid.
     */
    this.checkHit = function (firedBall) {
        var ballHit = false;

        for (var i = 0; i < this._config.hexaGridHeight; i++) {
            for (var j = 0; j < this._config.hexaGridWidth; j++) {

                //var imageURL = this._hexagrid[i][j].getImage().getURL();
                //console.warn('I was: ', imageURL, this._config.ballEmpty);
                //if (imageURL === this._config.ballEmpty) {
                //}

            }
        }

        return ballHit;
    }

});

/**
 * Game play.
 */
function start_game_flow () {
    // Create the hexagrid.
    this._hexagridId = [];
    this._hexagrid = [];
    for (var i = 0; i < this._config.hexaGridHeight; i++) {
        this._hexagridId[i] = [];
        this._hexagrid[i] = [];
        for (var j = 0; j < this._config.hexaGridWidth; j++) {

            // Model.
            this._hexagridId[i][j] = null;
            if (i < this._config.hexaGridFilled) {
                this._hexagridId[i][j] = Math.floor( Math.random() * this._config.ballLength);
            }

            // View.
            this._hexagrid[i][j] = new ImageView({
                superview: this,
                image: this.getBallSrc( this._hexagridId[i][j] ),
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
