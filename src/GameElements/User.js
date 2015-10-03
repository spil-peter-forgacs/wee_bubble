/**
 * User
 */

import ui.View;
import ui.ImageView as ImageView;

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

        var bg = new ImageView({
            superview: this,
            image: 'resources/images/bg2.jpg',
            width: width,
            height: height,
            x: 0,
            y: 0
        });

        this._enemyview = new ImageView({
            superview: this,
            image: 'resources/images/cannon.png',
            width: 60,
            height: 60,
            x: (width - 60) / 2,
            y: height - 60
        });

        this.on('user:start', start_game_flow.bind(this));
    };
});

/**
 * Game play.
 */
function start_game_flow () {
}
