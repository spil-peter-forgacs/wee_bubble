/**
 * HexaGrid
 */

import ui.View;
import ui.ImageView as ImageView;
import math.geom.intersect as intersect;

exports = Class(ui.View, function (supr) {
    this.init = function (opts) {

        this._config = JSON.parse(CACHE['resources/conf/config.json']);
        this._progress = 0;

        opts = merge(opts, {
            x: 0,
            y: 0,
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
     *
     * @param Object firedBall
     *
     * @return boolean ballHit
     */
    this.checkHit = function (firedBall) {
        var ballHit = false;

        for (var i = 0; i < this._config.hexaGridHeight; i++) {
            for (var j = this._config.hexaGridWidth - 1; j >= 0; j--) {

                // If not empty.
                if (this._hexagridId[i][j] !== null && !ballHit) {
                    ballHit = intersect.rectAndRect(this._hexagrid[i][j].style, firedBall.view.style);
                }

            }
        }

        if (ballHit) {
            this.attachBall(firedBall);
        }

        return ballHit;
    }

    this.attachBall = function (firedBall) {
        // Calculation of position.
        var x = firedBall.view.style.x;
        var y = firedBall.view.style.y;

        var i = (y - this._config.enemySize) / this._config.ballSize;
        i = Math.ceil(i);
        var j = (x - ((i % 2) * (this._config.ballSize / 2))) / this._config.ballSize;
        j = Math.round(j);

        // Border cases.
        j = (j >= this._config.hexaGridWidth ? j - 1 : j);
        j = (j <= 0 ? 0 : j);


        // Attach.
        this._hexagridId[i][j] = firedBall.model;
        this._hexagrid[i][j].setImage( this.getBallSrc( firedBall.model ) );
    }

    this.removeBalls = function () {
    }

    this.removeFloatingBalls = function () {
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
                x: (j * this._config.ballSize) + ((i % 2) * (this._config.ballSize / 2)),
                y: (i * this._config.ballSize) + this._config.enemySize
            });
        }
    }

}

/**
 * Game tick.
 */
function tick () {
}
