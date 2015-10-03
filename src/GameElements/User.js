/**
 * User
 */

import ui.View;

exports = Class(ui.View, function (supr) {
    this.init = function (opts) {
        opts = merge(opts, {
            x: 0,
            y: 0,
            width: 320,
            height: 480,
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function () {
        this.on('user:start', start_game_flow.bind(this));
    };
});

/**
 * Game play.
 */
function start_game_flow () {
}
