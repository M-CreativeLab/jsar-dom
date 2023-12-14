import type { IMaterial } from '../glTFLoaderInterfaces';
import type { IGLTFLoaderExtension } from '../glTFLoaderExtension';
import { GLTFLoader } from '../glTFLoader';

type Nullable<T> = BABYLON.Nullable<T>;
type Material = BABYLON.Material;
const NAME = 'MSFT_sRGBFactors';

/** @internal */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class MSFT_sRGBFactors implements IGLTFLoaderExtension {
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

        const useExactSrgbConversions = babylonMaterial.getScene().getEngine().useExactSrgbConversions;
        if (!babylonMaterial.albedoTexture) {
          babylonMaterial.albedoColor.toLinearSpaceToRef(babylonMaterial.albedoColor, useExactSrgbConversions);
        }

        if (!babylonMaterial.reflectivityTexture) {
          babylonMaterial.reflectivityColor.toLinearSpaceToRef(babylonMaterial.reflectivityColor, useExactSrgbConversions);
        }

        return promise;
      }

      return null;
    });
  }
}

GLTFLoader.RegisterExtension(NAME, (loader) => new MSFT_sRGBFactors(loader));
