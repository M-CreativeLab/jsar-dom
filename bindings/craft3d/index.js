import * as craft3d from './pkg/craft3d_binding';

let initCraft3DAsync = craft3d.default;
if (typeof initCraft3DAsync !== 'function') {
  initCraft3DAsync = initCraft3DAsync.default;
}

let loaded = false;
export async function loadCraft3D() {
  if (loaded) {
    return;
  } else {
    const wasmBinary = await import('./pkg/craft3d_binding_bg_wasm');
    await initCraft3DAsync(wasmBinary.default);
    loaded = true;
  }
}

export * from './pkg/craft3d_binding';
