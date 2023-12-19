const { createCanvas } = require('@napi-rs/canvas');

Error.stackTraceLimit = Infinity;

class OffscreenCanvas {
  #canvas = null;

  constructor(width, height) {
    this.#canvas = createCanvas(width, height);
  }

  get width() {
    return this.#canvas.width;
  }

  set width(value) {
    this.#canvas.width = value;
  }

  get height() {
    return this.#canvas.height;
  }

  set height(value) {
    this.#canvas.height = value;
  }

  getContext(contextType) {
    return this.#canvas.getContext(contextType);
  }
}
globalThis.OffscreenCanvas = OffscreenCanvas;
