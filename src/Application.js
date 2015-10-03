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
import src.soundcontroller as soundcontroller;

exports = Class(GC.Application, function () {

    this.initUI = function () {

        var titlescreen = new TitleScreen();

        this.view.style.backgroundColor = '#000000';

        // Create a stackview of size 320x480, then scale it to fit horizontally.
        var rootView = new StackView({
            superview: this,
            x: 0,
            y: 0,
            width: 320,
            height: 480,
            clip: true,
            scale: device.width / 320
        });

        rootView.push(titlescreen);

        var sound = soundcontroller.getSound();
        sound.play('Pamgaea');

        /**
         * Listen for an event dispatched by the title screen.
         */
        titlescreen.on('titlescreen:start', function () {
            console.warn('Titlescreen start button was pressed');
        });

    };

    this.launchUI = function () {
    };

});
