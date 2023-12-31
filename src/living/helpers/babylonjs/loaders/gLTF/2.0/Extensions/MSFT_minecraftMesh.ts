import type { IMaterial } from '../glTFLoaderInterfaces';
import type { IGLTFLoaderExtension } from '../glTFLoaderExtension';
import { GLTFLoader } from '../glTFLoader';

type Nullable<T> = BABYLON.Nullable<T>;
type Material = BABYLON.Material;
const NAME = 'MSFT_minecraftMesh';

/** @internal */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class MSFT_minecraftMesh implements IGLTFLoaderExtension {
  /** @internal */
  public readonly name = NAME;

  /** @internal */
  public enabled: boolean;

  private _loader: GLTFLoader;

  /** @internal */
  constructor(loader: GLTFLoader) {
    this._loader = loader;
    this.enabled = this._loader.isExtensionUsed(NAME);
  }

  /** @internal */
  public dispose() {
    (this._loader as any) = null;
  }

  /** @internal */
  public loadMaterialPropertiesAsync(context: string, material: IMaterial, babylonMaterial: Material): Nullable<Promise<void>> {
    return GLTFLoader.LoadExtraAsync<boolean>(context, material, this.name, (extraContext, extra) => {
      if (extra) {
        if (!(babylonMaterial instanceof BABYLON.PBRMaterial)) {
          throw new Error(`${extraContext}: Material type not supported`);
        }

        const promise = this._loader.loadMaterialPropertiesAsync(context, material, babylonMaterial);

        if (babylonMaterial.needAlphaBlending()) {
          babylonMaterial.forceDepthWrite = true;
          babylonMaterial.separateCullingPass = true;
        }

        babylonMaterial.backFaceCulling = babylonMaterial.forceDepthWrite;
        babylonMaterial.twoSidedLighting = true;

        return promise;
      }

      return null;
    });
  }
}

GLTFLoader.RegisterExtension(NAME, (loader) => new MSFT_minecraftMesh(loader));
