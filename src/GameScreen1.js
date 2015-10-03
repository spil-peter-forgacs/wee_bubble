/**
 * The game screen engine.
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
        this.on('game1:start', start_game_flow.bind(this));
    };
});

/*
 * Game play
 */

/* Manages the intro animation sequence before starting game.
 */
function start_game_flow () {
    var i = setInterval(tick.bind(this), 100);
}

/**
 * Game tick.
 */
function tick () {
}
