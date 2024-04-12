Error.stackTraceLimit = Infinity;
// Since many modules require babylonjs and jest does not have it, which must be imported globally.
global.BABYLON = require('babylonjs');
