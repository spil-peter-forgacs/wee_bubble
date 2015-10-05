/**
 * User
 */

import ui.View;
import ui.ImageView as ImageView;
import src.soundcontroller as soundcontroller;
import ui.ParticleEngine as ParticleEngine;

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

        this._ball0Id = this.getBallId();
        this._ball1Id = this.getBallId();
        this._ball2Id = this.getBallId();

        this.pEngine = new ParticleEngine({
            superview: this,
            width: 1,
            height: 1,
            initCount: 30
        });

        this.on('user:start', start_game_flow.bind(this));

        this.on('user:tick', tick.bind(this));

        // Rotation of cannon.
        this.inputDown = function (point) {
            var cannonCenterX = this._cannonview.style.x + (this._config.cannonSize / 2);
            var cannonCenterY = this._cannonview.style.y + (this._config.cannonSize / 2);

            var deltaX = point.x - cannonCenterX;
            var deltaY = point.y - cannonCenterY;

            var rotation = 0;

            if (deltaY != 0) {
                rotation = Math.atan2(deltaY, deltaX) + (Math.PI / 2);
            }

            // Safety element.
            // We don't want to allow user shoot to reverse direction.
            var maxRotation = 3 * Math.PI / 8;
            if (rotation > maxRotation && rotation < Math.PI) {
                rotation = maxRotation;
            }
            else if (rotation < -maxRotation || rotation > Math.PI) {
                rotation = -maxRotation;
            }

            this._cannonview.style.r = rotation;

            return rotation;
        }

        // Firing cannon or changing the ball.
        this.inputUp = function (point) {

            // Changing the ball.
            var ball2x = (this._config.screenWidth / 2) - this._config.cannonSize;
            var ball2y = this._config.screenHeight - this._config.ballSize;
            if (point.x >= ball2x && point.x <= ball2x + this._config.ballSize &&
                point.y >= ball2y && point.y <= ball2y + this._config.ballSize) {

                // Switch balls.
                var ballTmp = this._ball1Id;
                this._ball1Id = this._ball2Id;
                this._ball2Id = ballTmp;

                this._ball1.setImage( this.getBallSrc( this._ball1Id ) );
                this._ball2.setImage( this.getBallSrc( this._ball2Id ) );

                return;
            }


            // Firing cannon.
            var rotation = this.inputDown(point);

            if (this._isMoving) {
                return;
            }

            this._isMoving = true;

            // Update model and view.
            this._ball0Id = this._ball1Id;
            this._ball1Id = this._ball2Id;
            this._ball2Id = this.getBallId();
            this._ball0.setImage( this.getBallSrc( this._ball0Id ) );
            this._ball1.setImage( this.getBallSrc( this._ball1Id ) );
            this._ball2.setImage( this.getBallSrc( this._ball2Id ) );

            this._dx = Math.sin(rotation) * this._config.ballFiredSpeed;
            this._dy = -Math.cos(rotation) * this._config.ballFiredSpeed;

            var sound = soundcontroller.getSound();
            sound.play('whack');
        }

    };

    this.config = function (config) {
        this._config = config;
    };

    this.progress = function (progress) {
        this._progress = progress;
    };

    this.resetGame = function () {
        this._progress = 0;

        this._isMoving = false;
        this._dx = 0;
        this._dy = 0;

        this._ball0Id = this.getBallId();
        this._ball1Id = this.getBallId();
        this._ball2Id = this.getBallId();

        this._ball0.setImage( this.getBallSrc( this._ball0Id ) );
        this._ball1.setImage( this.getBallSrc( this._ball1Id ) );
        this._ball2.setImage( this.getBallSrc( this._ball2Id ) );

        this._ballBaseX = (this._config.screenWidth - this._config.ballSize) / 2;
        this._ballBaseY = this._config.screenHeight - (this._config.ballSize * 1.5);

        this._cannonview.style.r = 0;
    }

    this.getFiredBall = function () {
        if (!this._isMoving) {
            return null;
        }

        return {
            "model": this._ball0Id,
            "view": this._ball0,
            "dx": this._dx,
            "dy": this._dy,
            "isMoving": this._isMoving
        };
    }

    /**
     * Did the ball hit something?
     *
     * @param boolean ballHit
     */
    this.firedHit = function (ballHit) {
        if (!ballHit) {
            return;
        }


        var particleObjects = this.pEngine.obtainParticleArray(10);
        for (var i = 0; i < 10; i++) {
            var pObj = particleObjects[i];
            pObj.dx = Math.random() * 100;
            pObj.dy = Math.random() * 100;
            pObj.width = 20;
            pObj.height = 20;
            pObj.image = 'resources/images/sparkle.png';
            pObj.x = this._ball0.style.x;
            pObj.y = this._ball0.style.y;
        }
        this.pEngine.emitParticles(particleObjects);


        this._isMoving = false;

        // Reset base position.
        this._ball0.style.x = this._ballBaseX;
        this._ball0.style.y = this._ballBaseY;
    }

    /**
     * Get a random ball id.
     *
     * @return string ball
     */
    this.getBallId = function () {
        var ball = Math.floor( Math.random() * this._config.ballLength);

        return ball;
    }

    /**
     * Get the ball src.
     *
     * @param int i
     */
    this.getBallSrc = function ( i ) {
        var ballSrc = this._balls[ i ];

        return ballSrc;
    }

});

/**
 * Game play.
 */
function start_game_flow () {
    this._ball0Id = this.getBallId();
    this._ball1Id = this.getBallId();
    this._ball2Id = this.getBallId();

    this._ballBaseX = (this._config.screenWidth - this._config.ballSize) / 2;
    this._ballBaseY = this._config.screenHeight - (this._config.ballSize * 1.5);

    // Fired ball
    this._ball0 = new ImageView({
        superview: this,
        image: this.getBallSrc( this._ball0Id ),
        width: this._config.ballSize,
        height: this._config.ballSize,
        x: this._ballBaseX,
        y: this._ballBaseY
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
        image: this.getBallSrc( this._ball1Id ),
        width: this._config.ballSize,
        height: this._config.ballSize,
        x: this._ballBaseX,
        y: this._ballBaseY
    });

    // Next ball
    this._ball2 = new ImageView({
        superview: this,
        image: this.getBallSrc( this._ball2Id ),
        width: this._config.ballSize,
        height: this._config.ballSize,
        x: (this._config.screenWidth / 2) - this._config.cannonSize,
        y: this._config.screenHeight - this._config.ballSize
    });

    this.bottomLine = new ui.View({
        superview: this,
        x: 0,
        y: this._config.screenHeight - this._config.cannonSize - this._config.ballSize,
        width: this._config.screenWidth,
        height: 3,
        backgroundColor: '#000000'
    });

}

/**
 * Game tick.
 */
function tick () {
    // Particle
    this.pEngine.runTick(this._progress);


    if (!this._isMoving) {
        return;
    }

    this._ball0.style.x += this._dx * this._progress;
    this._ball0.style.y += this._dy * this._progress;

    // Left edge.
    if (this._ball0.style.x < 0) {
        this._dx = -this._dx;
        this._ball0.style.x = -this._ball0.style.x;
    }
    // Right edge.
    else if (this._ball0.style.x + this._config.ballSize > this._config.screenWidth) {
        this._dx = -this._dx;
        this._ball0.style.x -= this._ball0.style.x - (this._config.screenWidth - this._config.ballSize);
    }

    // Top edge.
    if (this._ball0.style.y + this._config.ballSize < 0) {
        this._isMoving = false;
    }
    // Bottom edge.
    else if (this._ball0.style.y > this._config.screenHeight) {
        this._isMoving = false;
    }

    if (!this._isMoving) {
        this._ball0.style.x = this._ballBaseX;
        this._ball0.style.y = this._ballBaseY;
    }
}
