import * as taffy from './pkg/taffy_binding';

let initTaffyAsync = taffy.default;
if (typeof initTaffyAsync !== 'function') {
  /**
   * FIXME: this is a workaround for the fact that the ESM build by ts-jest.
   * 
   * When a esm module has default export and named exports, "ts-jest/presets.jsWithTsESM" will
   * generate a module like this:
   * 
   * ```js
   * [Module: null prototype] {
   *   a;
   *   b;
   *   default: {
   *     a;
   *     b;
   *     default: ... <= Exactly the real default export
   *   }
   * }
   * ```
   * 
   * It seems that the default export is wrapped in another object, but other build tools like 
   * webpack generates a module like this:
   * 
   * ```js
   * {
   *   a;
   *   b;
   *   default: ... <= Exactly the real default export
   * }
   * ```
   * 
   * This workaround is to check if the first result of `taffy.default` is a function, if not,
   * we assume that the default export is wrapped in another object.
   * 
   * Does anyone know why this happens and how to fix it?
   */
  initTaffyAsync = initTaffyAsync.default;
}

let loaded = false;
export async function loadTaffy() {
  if (loaded) {
    return;
  } else {
    const wasmBinary = await import('./pkg/taffy_binding_bg_wasm');
    await initTaffyAsync(wasmBinary.default);
    loaded = true;
  }
}

export * from './pkg/taffy_binding';
