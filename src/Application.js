/**
 * WeeBubble
 *
 * Author: Peter Forgacs 2015
 */

// SDK imports
import device;
import ui.StackView as StackView;

// User imports
import src.TitleScreen as TitleScreen;
import src.GameScreen1 as GameScreen1;
import src.soundcontroller as soundcontroller;

exports = Class(GC.Application, function () {

    this.initUI = function () {

        this._config = JSON.parse(CACHE['resources/conf/config.json']);

        var titlescreen = new TitleScreen();
        var gamescreen1 = new GameScreen1();

        this.view.style.backgroundColor = '#000000';

        // Create a stackview, then scale it to fit horizontally.
        var rootView = new StackView({
            superview: this,
            x: 0,
            y: 0,
            width: this._config.screenWidth,
            height: this._config.screenHeight,
            clip: true,
            scale: device.width / this._config.screenWidth
        });

        rootView.push(titlescreen);

        var sound = soundcontroller.getSound();
        sound.play('Pamgaea');

        /**
         * Listen for an event dispatched by the title screen.
         */
        titlescreen.on('titlescreen:start', function () {
            rootView.push(gamescreen1);
            gamescreen1.emit('game1:start');
        });

        gamescreen1.on('gamescreen1:end', function () {
            rootView.pop();
        });

    };

    this.launchUI = function () {
    };

});
