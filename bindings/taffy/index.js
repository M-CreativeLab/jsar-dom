import * as taffy from './pkg/taffy_binding';

const initTaffyAsync = taffy.default;
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
