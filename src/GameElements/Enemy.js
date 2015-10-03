/**
 * Enemy
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
            height: this._config.enemySize,
        });

        supr(this, 'init', [opts]);

        this.build();
    };

    this.build = function () {

        this.on('enemy:start', start_game_flow.bind(this));

        this.on('enemy:tick', tick.bind(this));
    };

    this.getPos = function () {
        //@TODO
    }
});

/**
 * Game play.
 */
function start_game_flow () {

    this._enemyview = new ImageView({
        superview: this,
        image: 'resources/images/enemy.png',
        width: this._config.enemySize,
        height: this._config.enemySize,
        x: 0,
        y: 0
    });

}

/**
 * Game tick.
 */
function tick () {
}
