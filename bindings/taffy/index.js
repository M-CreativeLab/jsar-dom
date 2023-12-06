import initTaffyModule from './pkg/taffy_binding';
import wasmBinary from './pkg/taffy_binding_bg_wasm';

export async function initModule() {
  return initTaffyModule(Promise.resolve(wasmBinary));
}

export * from './pkg/taffy_binding';
