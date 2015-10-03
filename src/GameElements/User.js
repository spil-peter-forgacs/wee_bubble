/**
 * User
 */

import ui.View;
import ui.ImageView as ImageView;

/**
 * Game constants.
 */
var ballLength = 16;
var ballEmpty = 'resources/images/balls/empty.png';

exports = Class(ui.View, function (supr) {
    var width = 320;
    var height = 480;

    this.init = function (opts) {
        opts = merge(opts, {
            x: 0,
            y: 0,
            width: width,
            height: height,
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function () {

        // Load the balls.
        this._balls = [];
        for (var i = 0; i < ballLength; i++) {
            this._balls[i] = 'resources/images/balls/ball' + i + '.png';
        }

        // Background
        var bg = new ImageView({
            superview: this,
            image: 'resources/images/bg2.jpg',
            width: width,
            height: height,
            x: 0,
            y: 0
        });

        // Fired ball
        this._ball0 = new ImageView({
            superview: this,
            image: ballEmpty,
            width: 30,
            height: 30,
            x: (width - 30) / 2,
            y: height - 45
        });

        // Cannon
        this._cannonview = new ImageView({
            superview: this,
            image: 'resources/images/cannon.png',
            width: 60,
            height: 60,
            x: (width - 60) / 2,
            y: height - 60
        });

        // Cannon ball
        this._ball1 = new ImageView({
            superview: this,
            image: ballEmpty,
            width: 30,
            height: 30,
            x: (width - 30) / 2,
            y: height - 45
        });

        // Next ball
        this._ball2 = new ImageView({
            superview: this,
            image: ballEmpty,
            width: 30,
            height: 30,
            x: (width - 120) / 2,
            y: height - 30
        });

        this.on('user:start', start_game_flow.bind(this));
    };
});

/**
 * Game play.
 */
function start_game_flow () {
}
