import { MeshoptCompression } from '@babylonjs/core/Meshes/Compression/meshoptCompression';
import { MeshoptDecoder } from 'meshoptimizer';

(MeshoptCompression as any)._Default = {
  decodeGltfBufferAsync(source, count, stride, mode, filter) {
    return MeshoptDecoder.ready.then(() => {
      const result = new Uint8Array(count * stride);
      MeshoptDecoder.decodeGltfBuffer(result, count, stride, source, mode, filter);
      return result;
    });
  },
};
