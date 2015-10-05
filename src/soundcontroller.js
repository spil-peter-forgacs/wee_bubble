/**
 * Sound controller.
 */

import AudioManager;

exports.sound = null;

/**
 * Initialize the audio files if they haven't been already.
 */
exports.getSound = function () {
  if (!exports.sound) {
    exports.sound = new AudioManager({
      path: 'resources/sounds',
      files: {
        Pamgaea: {
          path: 'music',
          volume: 0.5,
          background: true,
          loop: true
        },
        buzz: {
          path: 'effect',
          background: false
        },
        whack: {
          path: 'effect',
          background: false
        }
      }
    });
  }
  return exports.sound;
};
