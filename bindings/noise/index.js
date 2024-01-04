import * as noise from './pkg/noise_binding';

let initNoiseAsync = noise.default;
if (typeof initNoiseAsync !== 'function') {
  initNoiseAsync = initNoiseAsync.default;
}

let loaded = false;
export async function loadNoise() {
  if (loaded) {
    return;
  } else {
    const wasmBinary = await import('./pkg/noise_binding_bg_wasm');
    await initNoiseAsync(wasmBinary.default);
    loaded = true;
  }
}

export * from './pkg/noise_binding';
