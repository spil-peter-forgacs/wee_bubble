/**
 * The game engine.
 */

// SDK imports
import ui.View;
import ui.ImageView as ImageView;

// User imports
import src.GameElements.Enemy as Enemy;
import src.GameElements.User as User;
import src.GameElements.HexaGrid as HexaGrid;

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

        this._input = false;

        // Background
        this._bg = new ImageView({
            superview: this,
            image: 'resources/images/bg2.jpg',
            width: this._config.screenWidth,
            height: this._config.screenHeight,
            x: 0,
            y: 0
        });

        this._user = new User();
        this._hexagrid = new HexaGrid();
        this._enemy = new Enemy();

        this.addSubview( this._user );
        this.addSubview( this._hexagrid );
        this.addSubview( this._enemy );

        this.on('game1:start', start_game_flow.bind(this));

        this.on('InputStart', function (event, point) {
            if (this.gameOver()) {
                return;
            }

            this._input = true;
            this._user.inputDown(point);
        });

        this.on('InputSelect', function (event, point) {
            if (this.gameOver()) {
                return;
            }

            this._input = false;
            this._user.inputUp(point);
        });

        this.on('InputMove', function (event, point) {
            if (this.gameOver()) {
                return;
            }

            if (this._input) {
                this._user.inputDown(point);
            }
        });

        // Game setup
        this._config.ballLength = 3;

        this._user.config(this._config);
        this._enemy.config(this._config);
        this._hexagrid.config(this._config);

        this._user.emit('user:start');
        this._enemy.emit('enemy:start');
        this._hexagrid.emit('hexagrid:start');
    };

    this.gameOver = function () {
        var enemy = this._enemy.getEnemy();
        var firedBall = this._user.getFiredBall();
        var hitEnemy = false;

        if (firedBall) {
            var firedBallStyle = firedBall.view.style;
            var enemyStyle = enemy.style;
            hitEnemy = (firedBallStyle.x >= enemyStyle.x &&
                        firedBallStyle.x <= enemyStyle.x + enemyStyle.width &&
                        firedBallStyle.y >= 0 &&
                        firedBallStyle.y <= enemyStyle.height);
        }

        return !this._hexagrid.getGridState() || hitEnemy;
    };
});

/**
 * Game play.
 */
function start_game_flow () {

    // Reset game.
    this._user.resetGame();
    this._enemy.resetGame();
    this._hexagrid.resetGame();

    this._startTime = Date.now();
    window.requestAnimationFrame(tick.bind(this));
}

/**
 * Game tick.
 */
function tick () {
    // Game over. The user lost.
    if (this.gameOver()) {
        // Does hexagrid reach the user?
        if (!this._hexagrid.getGridState()) {
            this._enemy.gameOverLose();
        }
        else {
            this._enemy.gameOverWin();
        }

        this._user.resetFiredBallPosition();

        setTimeout(bind(this, function () {
            this.emit('gamescreen1:end');
        }), 4000);

        return;
    }

    var timestamp = Date.now();
    var progress = timestamp - this._startTime;

    this._user.progress(progress);
    this._enemy.progress(progress);
    this._hexagrid.progress(progress);

    this._user.emit('user:tick');
    this._enemy.emit('enemy:tick');
    this._hexagrid.emit('hexagrid:tick');

    // Check, if the fired ball hit the hexagrid.
    var firedBall = this._user.getFiredBall();
    if (firedBall) {
        var ballHit = this._hexagrid.checkHit(firedBall);
        this._user.firedHit(ballHit);
    }

    this._startTime = timestamp;
    window.requestAnimationFrame(tick.bind(this));
}
