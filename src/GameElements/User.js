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

        // Background
        var bg = new ImageView({
            superview: this,
            image: 'resources/images/bg2.jpg',
            width: this._config.screenWidth,
            height: this._config.screenHeight,
            x: 0,
            y: 0
        });

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
            y: this._config.screenHeight - this._config.cannonSize
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

        this.on('user:start', start_game_flow.bind(this));

        this.on('user:tick', tick.bind(this));
    };
});

/**
 * Game play.
 */
function start_game_flow () {
}

/**
 * Game tick.
 */
function tick () {
}
