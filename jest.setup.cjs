Error.stackTraceLimit = Infinity;
// Since many modules require babylonjs and jest does not have it, which must be imported globally.
global.BABYLON = require('babylonjs');

// Patch requestAnimationFrame to run all animations synchronously
global.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0);
};
