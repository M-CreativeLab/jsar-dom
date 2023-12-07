import initTaffyModule from './pkg/taffy_binding';
import wasmBinary from './pkg/taffy_binding_bg_wasm';

let loaded = false;
export default async function load() {
  if (loaded) {
    return;
  } else {
    await initTaffyModule(Promise.resolve(wasmBinary));
    loaded = true;
  }
}

export * from './pkg/taffy_binding';
