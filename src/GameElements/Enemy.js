/**
 * Enemy
 */

import animate;
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

        this.on('enemy:start', start_game_flow.bind(this));

        this.on('enemy:tick', tick.bind(this));
    };

    this.config = function (config) {
        this._config = config;
    };

    this.progress = function (progress) {
        this._progress = progress;
    };

    this.resetGame = function () {
        this._progress = 0;
        this._animator.clear();

        this._enemyview.style.x = 0;
        this._enemyview.style.y = 0;
        this._enemyview.style.width = this._config.enemySize;
        this._enemyview.style.height = this._config.enemySize;
    }

    this.gameOver = function () {
        this._animator.now({width: this._config.screenWidth, height: this._config.screenHeight}, 1500, animate.easeIn);
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

    this._animator = animate(this._enemyview);
}

/**
 * Game tick.
 */
function tick () {
}
