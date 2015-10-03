/**
 * User
 */

import ui.View;
import ui.ImageView as ImageView;

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

        // Load the balls.
        this._balls = [];
        for (var i = 0; i < this._config.ballLength; i++) {
            this._balls[i] = 'resources/images/balls/ball' + i + '.png';
        }

        this.on('user:start', start_game_flow.bind(this));

        this.on('user:tick', tick.bind(this));

        this.inputDown = function (point) {
            var cannonCenterX = this._cannonview.style.x + (this._config.cannonSize / 2);
            var cannonCenterY = this._cannonview.style.y + (this._config.cannonSize / 2);

            var deltaX = point.x - cannonCenterX;
            var deltaY = point.y - cannonCenterY;

            var rotation = 0;

            if (deltaY != 0) {
                rotation = Math.atan2(deltaY, deltaX) + (Math.PI / 2);
            }

            this._cannonview.style.r = rotation;
        }

        this.inputUp = function (point) {
            //console.log("inputUp: " + point.x + "," + point.y);
        }

    };
});

/**
 * Game play.
 */
function start_game_flow () {

    // Fired ball
    this._ball0 = new ImageView({
        superview: this,
        image: this._config.ballEmpty,
        width: this._config.ballSize,
        height: this._config.ballSize,
        x: (this._config.screenWidth - this._config.ballSize) / 2,
        y: this._config.screenHeight - (this._config.ballSize * 1.5)
    });

    // Cannon
    this._cannonview = new ImageView({
        superview: this,
        image: 'resources/images/cannon.png',
        width: this._config.cannonSize,
        height: this._config.cannonSize,
        x: (this._config.screenWidth - this._config.cannonSize) / 2,
        y: this._config.screenHeight - this._config.cannonSize,
        anchorX: this._config.cannonSize / 2,
        anchorY: this._config.cannonSize / 2
    });

    // Cannon ball
    this._ball1 = new ImageView({
        superview: this,
        image: this._config.ballEmpty,
        width: this._config.ballSize,
        height: this._config.ballSize,
        x: (this._config.screenWidth - this._config.ballSize) / 2,
        y: this._config.screenHeight - (this._config.ballSize * 1.5)
    });

    // Next ball
    this._ball2 = new ImageView({
        superview: this,
        image: this._config.ballEmpty,
        width: this._config.ballSize,
        height: this._config.ballSize,
        x: (this._config.screenWidth / 2) - this._config.cannonSize,
        y: this._config.screenHeight - this._config.ballSize
    });

}

/**
 * Game tick.
 */
function tick () {
}
