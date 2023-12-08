import * as taffy from './pkg/taffy_binding';
const { initSync } = taffy;

let loaded = false;
export async function loadTaffy() {
  if (loaded) {
    return;
  } else {
    const wasmBinary = await import('./pkg/taffy_binding_bg_wasm');
    await initSync(wasmBinary.default);
    loaded = true;
  }
}

export * from './pkg/taffy_binding';
