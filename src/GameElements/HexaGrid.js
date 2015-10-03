/**
 * HexaGrid
 */

import ui.View;
import ui.ImageView as ImageView;

/**
 * Game constants.
 */
var hexaGridWidth = 10;
var hexaGridHeight = 12;
var hexaGridFilled = 4;
var ballLength = 16;
var ballEmpty = 'resources/images/balls/empty.png';

exports = Class(ui.View, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            x: 0,
            y: 60,
            width: 320,
            height: 420,
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function () {
        // Itaration variables.
        var i, j;

        // Load the balls.
        this._balls = [];
        for (i = 0; i < ballLength; i++) {
            this._balls[i] = 'resources/images/balls/ball' + i + '.png';
        }

        // Create the hexagrid.
        this._hexagrid = [];
        for (i = 0; i < hexaGridHeight; i++) {
            this._hexagrid[i] = [];
            for (j = 0; j < hexaGridWidth; j++) {
                this._hexagrid[i][j] = new ImageView({
                    superview: this,
                    image: ballEmpty,
                    //this._balls[ Math.floor( Math.random() * ballLength) ]
                    width: 30,
                    height: 30,
                    x: (j * 30) + (i % 2) * 15,
                    y: (i * 30)
                });
            }
        }

        this.on('hexagrid:start', start_game_flow.bind(this));
    };
});

/**
 * Game play.
 */
function start_game_flow () {
    hexaGridView();
}

/**
 * HexaGrid view.
 */
function hexaGridView() {
}
