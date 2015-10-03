/**
 * Enemy
 */

import ui.View;
import ui.ImageView as ImageView;

exports = Class(ui.View, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            x: 0,
            y: 0,
            width: 320,
            height: 60,
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function () {

        this._enemyview = new ImageView({
            superview: this,
            image: 'resources/images/enemy.png',
            width: 60,
            height: 60,
            x: 0,
            y: 0
        });

        this.on('enemy:start', start_game_flow.bind(this));
    };
});

/**
 * Game play.
 */
function start_game_flow () {
}
