/**
 * User
 */

import ui.View;
import ui.ImageView as ImageView;

exports = Class(ui.View, function (supr) {

    this.init = function (opts) {

        this._config = JSON.parse(CACHE['resources/conf/config.json']);
        this._progress = 0;

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

        this._isMoving = false;
        this._dx = 0;
        this._dy = 0;

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

            return rotation;
        }

        this.inputUp = function (point) {
            var rotation = this.inputDown(point);

            if (this._isMoving) {
                return;
            }

            this._isMoving = true;

            this._ball0.setImage( this._ball1.getImage() );
            this._ball1.setImage( this._ball2.getImage() );
            this._ball2.setImage( this.getBall() );

            this._dx = Math.sin(rotation) * this._config.ballFiredSpeed;
            this._dy = -Math.cos(rotation) * this._config.ballFiredSpeed;
        }

    };

    this.config = function (config) {
        this._config = config;
    };

    this.progress = function (progress) {
        this._progress = progress;
    };


    /**
     * Get a random ball.
     *
     * @return string ball
     */
    this.getBall = function () {
        var ball = this._balls[ Math.floor( Math.random() * this._config.ballLength) ];

        return ball;
    }

});

/**
 * Game play.
 */
function start_game_flow () {
    this.ballBaseX = (this._config.screenWidth - this._config.ballSize) / 2;
    this.ballBaseY = this._config.screenHeight - (this._config.ballSize * 1.5);

    // Fired ball
    this._ball0 = new ImageView({
        superview: this,
        image: this._config.ballEmpty,
        width: this._config.ballSize,
        height: this._config.ballSize,
        x: this.ballBaseX,
        y: this.ballBaseY
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
        image: this.getBall(),
        width: this._config.ballSize,
        height: this._config.ballSize,
        x: this.ballBaseX,
        y: this.ballBaseY
    });

    // Next ball
    this._ball2 = new ImageView({
        superview: this,
        image: this.getBall(),
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

    if (!this._isMoving) {
        return;
    }

    this._ball0.style.x += this._dx * this._progress;
    this._ball0.style.y += this._dy * this._progress;
}
