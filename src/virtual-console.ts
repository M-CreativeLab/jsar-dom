export class VirtualConsole extends EventTarget {
  constructor() {
    super();

    this.addEventListener('error', () => {});
  }

  sendTo(anyConsole, options) {
    // TODO
  }
}
