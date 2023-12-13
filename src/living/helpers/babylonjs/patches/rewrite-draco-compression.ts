import { DracoCompression } from '@babylonjs/core/Meshes/Compression/dracoCompression';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';

function decodeMesh(decoderModule, dataView, attributes, onIndicesData, onAttributeData, dividers) {
  const buffer = new decoderModule.DecoderBuffer();
  buffer.Init(dataView, dataView.byteLength);
  const decoder = new decoderModule.Decoder();
  let geometry;
  let status;
  try {
    const type = decoder.GetEncodedGeometryType(buffer);
    switch (type) {
      case decoderModule.TRIANGULAR_MESH:
        geometry = new decoderModule.Mesh();
        status = decoder.DecodeBufferToMesh(buffer, geometry);
        break;
      case decoderModule.POINT_CLOUD:
        geometry = new decoderModule.PointCloud();
        status = decoder.DecodeBufferToPointCloud(buffer, geometry);
        break;
      default:
        throw new Error(`Invalid geometry type ${type}`);
    }
    if (!status.ok() || !geometry.ptr) {
      throw new Error(status.error_msg());
    }
    if (type === decoderModule.TRIANGULAR_MESH) {
      const numFaces = geometry.num_faces();
      const numIndices = numFaces * 3;
      const byteLength = numIndices * 4;
      const ptr = decoderModule._malloc(byteLength);
      try {
        decoder.GetTrianglesUInt32Array(geometry, byteLength, ptr);
        const indices = new Uint32Array(numIndices);
        indices.set(new Uint32Array(decoderModule.HEAPF32.buffer, ptr, numIndices));
        onIndicesData(indices);
      }
      finally {
        decoderModule._free(ptr);
      }
    }
    const processAttribute = (kind, attribute, divider = 1) => {
      const numComponents = attribute.num_components();
      const numPoints = geometry.num_points();
      const numValues = numPoints * numComponents;
      const byteLength = numValues * Float32Array.BYTES_PER_ELEMENT;
      const ptr = decoderModule._malloc(byteLength);
      try {
        decoder.GetAttributeDataArrayForAllPoints(geometry, attribute, decoderModule.DT_FLOAT32, byteLength, ptr);
        const values = new Float32Array(decoderModule.HEAPF32.buffer, ptr, numValues);
        if (kind === "color" && numComponents === 3) {
          const babylonData = new Float32Array(numPoints * 4);
          for (let i = 0, j = 0; i < babylonData.length; i += 4, j += numComponents) {
            babylonData[i + 0] = values[j + 0];
            babylonData[i + 1] = values[j + 1];
            babylonData[i + 2] = values[j + 2];
            babylonData[i + 3] = 1;
          }
          onAttributeData(kind, babylonData);
        }
        else {
          const babylonData = new Float32Array(numValues);
          babylonData.set(new Float32Array(decoderModule.HEAPF32.buffer, ptr, numValues));
          if (divider !== 1) {
            for (let i = 0; i < babylonData.length; i++) {
              babylonData[i] = babylonData[i] / divider;
            }
          }
          onAttributeData(kind, babylonData);
        }
      }
      finally {
        decoderModule._free(ptr);
      }
    };
    if (attributes) {
      for (const kind in attributes) {
        const id = attributes[kind];
        const attribute = decoder.GetAttributeByUniqueId(geometry, id);
        const divider = (dividers && dividers[kind]) || 1;
        processAttribute(kind, attribute, divider);
      }
    }
    else {
      const nativeAttributeTypes = {
        position: "POSITION",
        normal: "NORMAL",
        color: "COLOR",
        uv: "TEX_COORD",
      };
      for (const kind in nativeAttributeTypes) {
        const id = decoder.GetAttributeId(geometry, decoderModule[nativeAttributeTypes[kind]]);
        if (id !== -1) {
          const attribute = decoder.GetAttribute(geometry, id);
          processAttribute(kind, attribute);
        }
      }
    }
  }
  finally {
    if (geometry) {
      decoderModule.destroy(geometry);
    }
    decoderModule.destroy(decoder);
    decoderModule.destroy(buffer);
  }
}

// Check if the browser env
if (typeof window === 'undefined') {
  const decoderModulePending = Promise.all([
      import('./draco_decoder_gltf.cjs'),
      import('./draco_decoder_gltf.wasm.cjs'),
  ]).then(([DracoDecoderModule, wasmBinary]) => {
    return DracoDecoderModule.default(wasmBinary.default);
  });

  (DracoCompression as any)._Default = {
    dispose() {
      return null;
    },
    /**
     * Returns a promise that resolves when ready. Call this manually to ensure draco compression is ready before use.
     * @returns a promise that resolves when ready
     */
    whenReadyAsync() {
      return decoderModulePending;
    },
    /**
     * Decode Draco compressed mesh data to vertex data.
     * @param data The ArrayBuffer or ArrayBufferView for the Draco compression data
     * @param attributes A map of attributes from vertex buffer kinds to Draco unique ids
     * @param dividers a list of optional dividers for normalization
     * @returns A promise that resolves with the decoded vertex data
     */
    decodeMeshAsync(data: ArrayBuffer | ArrayBufferView, attributes, dividers) {
      const dataView = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
      return decoderModulePending.then((decoderModule) => {
        const vertexData = new VertexData();
        decodeMesh(decoderModule, dataView, attributes, (indices) => {
          vertexData.indices = indices;
        }, (kind, data) => {
          vertexData.set(data, kind);
        }, dividers);
        return vertexData;
      });
    }
  };
}

