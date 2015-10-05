/**
 * HexaGrid
 */

import ui.View;
import ui.ImageView as ImageView;
import math.geom.intersect as intersect;
import src.soundcontroller as soundcontroller;

exports = Class(ui.View, function (supr) {
    this.init = function (opts) {

        this._config = JSON.parse(CACHE['resources/conf/config.json']);
        this._progress = 0;

        // Game state.
        this._gridRun = true;

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

    this.resetGame = function () {
        this._progress = 0;
        this._gridRun = true;
        this.style.y = 0;

        // Reset hexagrid.
        for (var i = 0; i < this._config.hexaGridHeight; i++) {
            for (var j = 0; j < this._config.hexaGridWidth; j++) {

                // Model.
                this._hexagridId[i][j] = null;
                if (i < this._config.hexaGridFilled) {
                    this._hexagridId[i][j] = Math.floor( Math.random() * this._config.ballLength);
                }

                // View.
                this._hexagrid[i][j].setImage( this.getBallSrc( this._hexagridId[i][j] ) );
            }
        }
    }

    this.getGridState = function() {
        return this._gridRun;
    }

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

        // Calculation of position.
        var x = firedBall.view.style.x;
        var y = firedBall.view.style.y;

        var ir = (y - this._config.enemySize - this.style.y) / this._config.ballSize;
        var i = Math.round(ir);
        var jr = (x - ((i % 2) * (this._config.ballSize / 2))) / this._config.ballSize;
        var j = Math.round(jr);

        // Border cases.
        j = (j >= this._config.hexaGridWidth ? j - 1 : j);
        j = (j <= 0 ? 0 : j);


        // Fly away...
        if (i < 0) {
            return ballHit;
        }


        // Helper variable.
        var k;

        // Alternative empty space.
        var alternativeI = null;
        var alternativeJ = null;

        // Helping the ball go up, if there was empty space.
        var upLeftI = null;
        var upLeftJ = null;
        var upRightI = null;
        var upRightJ = null;

        // Up
        if (i > 0) {
            // Up left
            k = j - 1 + (i % 2);
            if (k >= 0) {
                ballHit = (ballHit || this._hexagridId[i - 1][k] !== null);
                if (this._hexagridId[i - 1][k] === null) {
                    alternativeI = i - 1;
                    alternativeJ = k;

                    // Helping the ball.
                    upLeftI = i - 1;
                    upLeftJ = k;
                }
            }
            // Up right
            k = j + (i % 2);
            if (k < this._config.hexaGridWidth) {
                ballHit = (ballHit || this._hexagridId[i - 1][k] !== null);
                if (this._hexagridId[i - 1][k] === null) {
                    alternativeI = i - 1;
                    alternativeJ = k;

                    // Helping tha ball.
                    upRightI = i - 1;
                    upRightJ = k;
                }
            }
        }
        // Down
        if (i < this._config.hexaGridHeight) {
            // Down left
            k = j - 1 + (i % 2);
            if (k >= 0) {
                ballHit = (ballHit || this._hexagridId[i + 1][k] !== null);
                if (this._hexagridId[i + 1][k] === null) {
                    alternativeI = i + 1;
                    alternativeJ = k;
                }
            }
            // Down right
            k = j + (i % 2);
            if (k < this._config.hexaGridWidth) {
                ballHit = (ballHit || this._hexagridId[i + 1][k] !== null);
                if (this._hexagridId[i + 1][k] === null) {
                    alternativeI = i + 1;
                    alternativeJ = k;
                }
            }
        }
        // Left
        if (j > 0) {
            ballHit = (ballHit || this._hexagridId[i][j - 1] !== null);
            if (this._hexagridId[i][j - 1] === null) {
                alternativeI = i;
                alternativeJ = j - 1;
            }
        }
        // Right
        if (j < this._config.hexaGridWidth - 1) {
            ballHit = (ballHit || this._hexagridId[i][j + 1] !== null);
            if (this._hexagridId[i][j + 1] === null) {
                alternativeI = i;
                alternativeJ = j + 1;
            }
        }


        // If the ball place empty, and also to up in the ball direction, it can go.
        if (this._hexagridId[i][j] === null) {
            // Ball goes to left and it is empty.
            if (firedBall.dx <= 0 && upLeftI !== null && upLeftJ !== null) {
                return;
            }
            // Ball goes to right and it is empty.
            else if (firedBall.dx >= 0 && upRightI !== null && upRightJ !== null) {
                return;
            }
        }


        // If the calculated place occupied, choose the alternative empty one.
        if (this._hexagridId[i][j] !== null && alternativeI !== null && alternativeJ !== null) {
            ballHit = true;
            i = alternativeI;
            j = alternativeJ;
        }


        if (ballHit) {
            var sound = soundcontroller.getSound();
            sound.play('buzz');

            this.attachBall(firedBall, i, j);
        }

        return ballHit;
    }

    /**
     * Attach the ball in case of hit.
     */
    this.attachBall = function (firedBall, i, j) {
        // Attach.
        this._hexagridId[i][j] = firedBall.model;
        this._hexagrid[i][j].setImage( this.getBallSrc( firedBall.model ) );

        this.removeBalls(i, j);
    }

    /**
     * Remove balls with the same color.
     */
    this.removeBalls = function (posI, posJ) {
        // Create tmp grid.
        this._hexagridTmp = [];
        for (var i = 0; i < this._config.hexaGridHeight; i++) {
            this._hexagridTmp[i] = [];
            for (var j = 0; j < this._config.hexaGridWidth; j++) {
                this._hexagridTmp[i][j] = null;
            }
        }

        // Check the chain of ball in same color.
        var chain = 0;
        var id = this._hexagridId[posI][posJ];
        chain = this.markBall(posI, posJ, id, chain);

        if (chain < 3) {
            return;
        }

        // Remove
        for (var i = 0; i < this._config.hexaGridHeight; i++) {
            for (var j = 0; j < this._config.hexaGridWidth; j++) {
                if (this._hexagridTmp[i][j]) {
                    this._hexagridId[i][j] = null;
                    this._hexagrid[i][j].setImage( this._config.ballEmpty );
                }
            }
        }

        this.removeFloatingBalls();
    }

    /**
     * Helper recursive function for checking the hexagrid.
     *
     * @param int i
     * @param int j
     * @param int id
     *     ID of the ball, or null in case of empty ball space check
     * @param int chain
     *     The chain detected
     *
     * @return int chain
     */
    this.markBall = function (i, j, id, chain) {
        // It is already marked? Then it is done.
        if (this._hexagridTmp[i][j]) {
            return chain;
        }

        // Not markable for remove balls?
        if (id !== null && this._hexagridId[i][j] !== id) {
            return chain;
        }
        // Not markable for floating balls?
        if (id === null && this._hexagridId[i][j] === null) {
            return chain;
        }

        // Mark it. Don't reprocede again.
        this._hexagridTmp[i][j] = true;
        chain++;


        // Check neighbours.

        // Helper variable.
        var k;

        // Left
        if (j > 0) {
            chain = this.markBall(i, j - 1, id, chain);
        }
        // Right
        if (j < this._config.hexaGridWidth - 1) {
            chain = this.markBall(i, j + 1, id, chain);
        }
        // Up
        if (i > 0) {
            // Up left
            k = j - 1 + (i % 2);
            if (k >= 0) {
                chain = this.markBall(i - 1, k, id, chain);
            }
            // Up right
            k = j + (i % 2);
            if (k < this._config.hexaGridWidth) {
                chain = this.markBall(i - 1, k, id, chain);
            }
        }
        // Down
        if (i < this._config.hexaGridHeight) {
            // Down left
            k = j - 1 + (i % 2);
            if (k >= 0) {
                chain = this.markBall(i + 1, k, id, chain);
            }
            // Down right
            k = j + (i % 2);
            if (k < this._config.hexaGridWidth) {
                chain = this.markBall(i + 1, k, id, chain);
            }
        }

        return chain;
    }

    /**
     * Function for removing the floating balls, if there is any.
     */
    this.removeFloatingBalls = function () {
        // Create tmp grid.
        this._hexagridTmp = [];
        for (var i = 0; i < this._config.hexaGridHeight; i++) {
            this._hexagridTmp[i] = [];
            for (var j = 0; j < this._config.hexaGridWidth; j++) {
                this._hexagridTmp[i][j] = null;
            }
        }


        // Checking.
        // We don't use chain here, but later we can for scoring.
        var chain = 0;
        var id = null;
        for (var j = 0; j < this._config.hexaGridWidth; j++) {
            chain = this.markBall(0, j, id, chain);
        }

        // Remove
        for (var i = 0; i < this._config.hexaGridHeight; i++) {
            for (var j = 0; j < this._config.hexaGridWidth; j++) {
                if (!this._hexagridTmp[i][j]) {
                    this._hexagridId[i][j] = null;
                    this._hexagrid[i][j].setImage( this._config.ballEmpty );
                }
            }
        }
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
    // Check lowest ball for game over.
    var lowestBall = 0;
    for (var i = 0; i < this._config.hexaGridHeight; i++) {
        for (var j = 0; j < this._config.hexaGridWidth; j++) {
            if (this._hexagridId[i][j] !== null) {
                lowestBall = i;
            }
        }
    }

    lowestBall += Math.floor(this.style.y / this._config.ballSize);

    if (lowestBall >= 10) {
        this._gridRun = false;
        return;
    }


    // Move grid.
    this.style.y += this._config.hexaGridSpeed * this._progress;

    if (this.style.y < 2 * this._config.ballSize) {
        return;
    }


    // Create new bubble lines.
    this.style.y -= 2 * this._config.ballSize;

    for (var i = this._config.hexaGridHeight - 1; i >= 0 ; i--) {
        for (var j = 0; j < this._config.hexaGridWidth; j++) {
            if (i > 1) {
                this._hexagridId[i][j] = this._hexagridId[i - 2][j];
            }
            else {
                this._hexagridId[i][j] = Math.floor( Math.random() * this._config.ballLength);
            }
            this._hexagrid[i][j].setImage( this.getBallSrc( this._hexagridId[i][j] ) );
        }
    }

}
