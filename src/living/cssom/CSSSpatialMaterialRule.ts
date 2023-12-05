import { NativeDocument } from '../../impl-interfaces';
import { MATERIAL_BY_SCSS } from '../helpers/babylonjs/tags';
import { AtMaterial, parseCss, css, isComment } from '../helpers/spatial-css-parser';
import CSSRuleImpl from './CSSRule';
import CSSSpatialStyleDeclaration from './CSSSpatialStyleDeclaration';

export default class CSSSpatialMaterialRule extends CSSRuleImpl {
  readonly style: CSSSpatialStyleDeclaration = new CSSSpatialStyleDeclaration();
  private _name: string;
  private _scene: BABYLON.Scene;
  private _material: BABYLON.Material;

  get name(): string {
    return this._name;
  }

  constructor(
    hostObject: NativeDocument,
    args: any[],
    privateData: {
      node: AtMaterial;
      ast: ReturnType<typeof parseCss>;
    }
  ) {
    super(hostObject, args, {
      ...privateData.node,
      ast: privateData.ast,
    });
    this._scene = hostObject.getNativeScene();

    if (privateData.node) {
      this._name = privateData.node.name;
      this._initiateStyle(privateData.node.declarations);
    }
    this._createMaterial();
  }

  private _initiateStyle(decls: Array<css.Comment | css.Declaration>) {
    for (const decl of decls) {
      if (!isComment(decl)) {
        let priority = null;
        let value = decl.value;
        if (decl.value.endsWith(' !important')) {
          priority = 'important';
          value = decl.value.slice(0, -' !important'.length);
        }
        this.style.setProperty(decl.property, value, priority);
      }
    }
  }

  private _setMaterialColor(name: string, setter: (color: BABYLON.Color3) => void) {
    const color = this.style._getPropertyValue(name)?.toColor();
    if (color) {
      setter(new BABYLON.Color3(
        color.r / 255.0,
        color.g / 255.0,
        color.b / 255.0
      ));
    }
  }

  private _setMaterialTexture(name: string, setter: (texture: BABYLON.Texture) => void) {
    const textureUrl = this.style._getPropertyValue(name)?.toUrlString();
    console.log(textureUrl);
    if (textureUrl) {
      const tex = new BABYLON.Texture(textureUrl, this._scene);
      setter(tex);
    }
  }

  private _getMaterialType() {
    const type = this.style._getPropertyValue('material-type');
    return type ? type.str : 'standard';
  }

  private _createMaterial(): void {
    if (!this._scene) {
      return;
    }
    const type = this._getMaterialType();
    if (type === 'physical-based') {
      const mat = new BABYLON.PBRMaterial(this.name, this._scene);
      if (this.style.physicalMetallic) {
        const metallicValue = this.style._getPropertyValue('physical-metallic').toNumber();
        if (metallicValue >= 0 && metallicValue <= 1) {
          mat.metallic = metallicValue;
        }
      } else {
        mat.metallic = 1;
      }
      if (this.style.physicalRoughness) {
        const roughnessValue = this.style._getPropertyValue('physical-roughness').toNumber();
        if (roughnessValue >= 0 && roughnessValue <= 1) {
          mat.roughness = roughnessValue;
        }
      }
      if (this.style.albedoColor) {
        this._setMaterialColor('albedo-color', color => mat.albedoColor = color);
      }
      if (this.style.albedoTexture) {
        this._setMaterialTexture('albedo-texture', texture => mat.albedoTexture = texture);
      }
      if (this.style.emissiveColor) {
        this._setMaterialColor('emissive-color', color => mat.emissiveColor = color);
      }
      this._material = mat;
    } else {
      const mat = new BABYLON.StandardMaterial(this.name, this._scene);
      if (this.style.diffuseColor) {
        this._setMaterialColor('diffuse-color', color => mat.diffuseColor = color);
      }
      if (this.style.diffuseTexture) {
        this._setMaterialTexture('diffuse-texture', texture => mat.diffuseTexture = texture);
      }
      if (this.style.ambientColor) {
        this._setMaterialColor('ambient-color', color => mat.ambientColor = color);
      }
      if (this.style.emissiveColor) {
        this._setMaterialColor('emissive-color', color => mat.emissiveColor = color);
      }
      if (this.style.specularColor) {
        this._setMaterialColor('specular-color', color => mat.specularColor = color);
      }
      if (this.style.specularPower) {
        const powerValue = this.style._getPropertyValue('specular-power').toNumber();
        if (powerValue >= 0 && powerValue <= 128) {
          mat.specularPower = powerValue;
        }
      }
      this._material = mat;
    }

    if (this.style.materialOrientation) {
      const materialOrientation = this.style._getPropertyValue('material-orientation').value;
      if (materialOrientation === 'clockwise') {
        this._material.sideOrientation = BABYLON.Material.ClockWiseSideOrientation;
      } else if (materialOrientation === 'counter-clockwise') {
        this._material.sideOrientation = BABYLON.Material.CounterClockWiseSideOrientation;
      }
    }
    if (this.style.wireframe) {
      const wireframe = this.style._getPropertyValue('wireframe').value;
      this._material.wireframe = wireframe === 'yes';
    }
    BABYLON.Tags.AddTagsTo(this._material, MATERIAL_BY_SCSS);
  }
}
