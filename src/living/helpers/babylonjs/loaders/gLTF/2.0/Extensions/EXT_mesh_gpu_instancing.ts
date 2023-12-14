import { GLTFLoader, ArrayItem } from '../glTFLoader';
import type { IGLTFLoaderExtension } from '../glTFLoaderExtension';
import type { INode } from '../glTFLoaderInterfaces';
import type { IEXTMeshGpuInstancing } from 'babylonjs-gltf2interface';

// import 'core/Meshes/thinInstanceMesh';
const NAME = 'EXT_mesh_gpu_instancing';

/**
 * [Specification](https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Vendor/EXT_mesh_gpu_instancing/README.md)
 * [Playground Sample](https://playground.babylonjs.com/#QFIGLW#9)
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class EXT_mesh_gpu_instancing implements IGLTFLoaderExtension {
    /**
     * The name of this extension.
     */
    public readonly name = NAME;

    /**
     * Defines whether this extension is enabled.
     */
    public enabled: boolean;

    private _loader: GLTFLoader;

    /**
     * @internal
     */
    constructor(loader: GLTFLoader) {
        this._loader = loader;
        this.enabled = this._loader.isExtensionUsed(NAME);
    }

    /** @internal */
    public dispose() {
        (this._loader as any) = null;
    }

    /**
     * @internal
     */
    public loadNodeAsync(context: string, node: INode, assign: (babylonTransformNode: BABYLON.TransformNode) => void): BABYLON.Nullable<Promise<BABYLON.TransformNode>> {
        return GLTFLoader.LoadExtensionAsync<IEXTMeshGpuInstancing, BABYLON.TransformNode>(context, node, this.name, (extensionContext, extension) => {
            this._loader._disableInstancedMesh++;

            const promise = this._loader.loadNodeAsync(`/nodes/${node.index}`, node, assign);

            this._loader._disableInstancedMesh--;

            if (!node._primitiveBabylonMeshes) {
                return promise;
            }

            const promises = new Array<Promise<BABYLON.Nullable<Float32Array>>>();
            let instanceCount = 0;

            const loadAttribute = (attribute: string) => {
                if (extension.attributes[attribute] == undefined) {
                    promises.push(Promise.resolve(null));
                    return;
                }

                const accessor = ArrayItem.Get(`${extensionContext}/attributes/${attribute}`, this._loader.gltf.accessors, extension.attributes[attribute]);
                promises.push(this._loader._loadFloatAccessorAsync(`/accessors/${accessor.bufferView}`, accessor));

                if (instanceCount === 0) {
                    instanceCount = accessor.count;
                } else if (instanceCount !== accessor.count) {
                    throw new Error(`${extensionContext}/attributes: Instance buffer accessors do not have the same count.`);
                }
            };

            loadAttribute('TRANSLATION');
            loadAttribute('ROTATION');
            loadAttribute('SCALE');

            return promise.then((babylonTransformNode) => {
                return Promise.all(promises).then(([translationBuffer, rotationBuffer, scaleBuffer]) => {
                    const matrices = new Float32Array(instanceCount * 16);

                    BABYLON.TmpVectors.Vector3[0].copyFromFloats(0, 0, 0); // translation
                    BABYLON.TmpVectors.Quaternion[0].copyFromFloats(0, 0, 0, 1); // rotation
                    BABYLON.TmpVectors.Vector3[1].copyFromFloats(1, 1, 1); // scale

                    for (let i = 0; i < instanceCount; ++i) {
                        translationBuffer && BABYLON.Vector3.FromArrayToRef(translationBuffer, i * 3, BABYLON.TmpVectors.Vector3[0]);
                        rotationBuffer && BABYLON.Quaternion.FromArrayToRef(rotationBuffer, i * 4, BABYLON.TmpVectors.Quaternion[0]);
                        scaleBuffer && BABYLON.Vector3.FromArrayToRef(scaleBuffer, i * 3, BABYLON.TmpVectors.Vector3[1]);

                        BABYLON.Matrix.ComposeToRef(BABYLON.TmpVectors.Vector3[1], BABYLON.TmpVectors.Quaternion[0], BABYLON.TmpVectors.Vector3[0], BABYLON.TmpVectors.Matrix[0]);

                        BABYLON.TmpVectors.Matrix[0].copyToArray(matrices, i * 16);
                    }

                    for (const babylonMesh of node._primitiveBabylonMeshes!) {
                        (babylonMesh as BABYLON.Mesh).thinInstanceSetBuffer('matrix', matrices, 16, true);
                    }

                    return babylonTransformNode;
                });
            });
        });
    }
}

GLTFLoader.RegisterExtension(NAME, (loader) => new EXT_mesh_gpu_instancing(loader));
