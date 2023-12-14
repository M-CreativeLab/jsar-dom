import { GLTFLoaderExtension, GLTFLoaderBase, GLTFLoader } from './glTFLoader';
import type { IGLTFRuntime, IGLTFMaterial } from './glTFLoaderInterfaces';

interface IGLTFMaterialsCommonExtensionValues {
  ambient?: number[] | string;
  diffuse?: number[] | string;
  emission?: number[] | string;
  specular?: number[] | string;
  shininess?: number;
  transparency?: number;
}

interface IGLTFMaterialsCommonExtension {
  technique: string;
  transparent?: number;
  doubleSided?: boolean;
  values: IGLTFMaterialsCommonExtensionValues;
}

interface IGLTFRuntimeCommonExtension {
  lights: { [key: string]: IGLTFLightCommonExtension };
}

interface IGLTFLightCommonExtension {
  name: string;
  type: string;

  ambient?: IGLTFAmbientLightCommonExtension;
  point?: IGLTFPointLightCommonExtension;
  directional?: IGLTFDirectionalLightCommonExtension;
  spot?: IGLTFSpotLightCommonExtension;
}

interface IGLTFPointLightCommonExtension {
  color: number[];
  constantAttenuation: number;
  linearAttenuation: number;
  quadraticAttenuation: number;
}

interface IGLTFAmbientLightCommonExtension {
  color: number[];
}

interface IGLTFDirectionalLightCommonExtension {
  color: number[];
}

interface IGLTFSpotLightCommonExtension {
  color: number[];
  constantAttenuation: number;
  fallOffAngle: number;
  fallOffExponent: number;
  linearAttenuation: number;
  quadraticAttenuation: number;
}

/**
 * @internal
 * @deprecated
 */
export class GLTFMaterialsCommonExtension extends GLTFLoaderExtension {
  constructor() {
    super('KHR_materials_common');
  }

  public loadRuntimeExtensionsAsync(gltfRuntime: IGLTFRuntime): boolean {
    if (!gltfRuntime.extensions) {
      return false;
    }

    const extension: IGLTFRuntimeCommonExtension = gltfRuntime.extensions[this.name];
    if (!extension) {
      return false;
    }

    // Create lights
    const lights = extension.lights;
    if (lights) {
      for (const thing in lights) {
        const light: IGLTFLightCommonExtension = lights[thing];

        switch (light.type) {
          case 'ambient': {
            const ambientLight = new BABYLON.HemisphericLight(light.name, new BABYLON.Vector3(0, 1, 0), gltfRuntime.scene);
            const ambient = light.ambient;
            if (ambient) {
              ambientLight.diffuse = BABYLON.Color3.FromArray(ambient.color || [1, 1, 1]);
            }
            break;
          }
          case 'point': {
            const pointLight = new BABYLON.PointLight(light.name, new BABYLON.Vector3(10, 10, 10), gltfRuntime.scene);
            const point = light.point;
            if (point) {
              pointLight.diffuse = BABYLON.Color3.FromArray(point.color || [1, 1, 1]);
            }
            break;
          }
          case 'directional': {
            const dirLight = new BABYLON.DirectionalLight(light.name, new BABYLON.Vector3(0, -1, 0), gltfRuntime.scene);
            const directional = light.directional;
            if (directional) {
              dirLight.diffuse = BABYLON.Color3.FromArray(directional.color || [1, 1, 1]);
            }
            break;
          }
          case 'spot': {
            const spot = light.spot;
            if (spot) {
              const spotLight = new BABYLON.SpotLight(
                light.name,
                new BABYLON.Vector3(0, 10, 0),
                new BABYLON.Vector3(0, -1, 0),
                spot.fallOffAngle || Math.PI,
                spot.fallOffExponent || 0.0,
                gltfRuntime.scene
              );
              spotLight.diffuse = BABYLON.Color3.FromArray(spot.color || [1, 1, 1]);
            }
            break;
          }
          default:
            BABYLON.Tools.Warn('GLTF Material Common extension: light type "' + light.type + '" not supported');
            break;
        }
      }
    }

    return false;
  }

  public loadMaterialAsync(gltfRuntime: IGLTFRuntime, id: string, onSuccess: (material: BABYLON.Material) => void, onError: (message: string) => void): boolean {
    const material: IGLTFMaterial = gltfRuntime.materials[id];
    if (!material || !material.extensions) {
      return false;
    }

    const extension: IGLTFMaterialsCommonExtension = material.extensions[this.name];
    if (!extension) {
      return false;
    }

    const standardMaterial = new BABYLON.StandardMaterial(id, gltfRuntime.scene);
    standardMaterial.sideOrientation = BABYLON.Material.CounterClockWiseSideOrientation;

    if (extension.technique === 'CONSTANT') {
      standardMaterial.disableLighting = true;
    }

    standardMaterial.backFaceCulling = extension.doubleSided === undefined ? false : !extension.doubleSided;
    standardMaterial.alpha = extension.values.transparency === undefined ? 1.0 : extension.values.transparency;
    standardMaterial.specularPower = extension.values.shininess === undefined ? 0.0 : extension.values.shininess;

    // Ambient
    if (typeof extension.values.ambient === 'string') {
      this._loadTexture(gltfRuntime, extension.values.ambient, standardMaterial, 'ambientTexture', onError);
    } else {
      standardMaterial.ambientColor = BABYLON.Color3.FromArray(extension.values.ambient || [0, 0, 0]);
    }

    // Diffuse
    if (typeof extension.values.diffuse === 'string') {
      this._loadTexture(gltfRuntime, extension.values.diffuse, standardMaterial, 'diffuseTexture', onError);
    } else {
      standardMaterial.diffuseColor = BABYLON.Color3.FromArray(extension.values.diffuse || [0, 0, 0]);
    }

    // Emission
    if (typeof extension.values.emission === 'string') {
      this._loadTexture(gltfRuntime, extension.values.emission, standardMaterial, 'emissiveTexture', onError);
    } else {
      standardMaterial.emissiveColor = BABYLON.Color3.FromArray(extension.values.emission || [0, 0, 0]);
    }

    // Specular
    if (typeof extension.values.specular === 'string') {
      this._loadTexture(gltfRuntime, extension.values.specular, standardMaterial, 'specularTexture', onError);
    } else {
      standardMaterial.specularColor = BABYLON.Color3.FromArray(extension.values.specular || [0, 0, 0]);
    }

    return true;
  }

  private _loadTexture(gltfRuntime: IGLTFRuntime, id: string, material: BABYLON.StandardMaterial, propertyPath: string, onError: (message: string) => void): void {
    // Create buffer from texture url
    GLTFLoaderBase.LoadTextureBufferAsync(
      gltfRuntime,
      id,
      (buffer) => {
        // Create texture from buffer
        GLTFLoaderBase.CreateTextureAsync(gltfRuntime, id, buffer, (texture) => ((<any>material)[propertyPath] = texture));
      },
      onError
    );
  }
}

GLTFLoader.RegisterExtension(new GLTFMaterialsCommonExtension());
