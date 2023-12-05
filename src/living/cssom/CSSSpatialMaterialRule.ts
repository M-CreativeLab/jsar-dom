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

  private _createMaterial(): void {
    if (!this._scene) {
      return;
    }
    const mat = this._material = new BABYLON.StandardMaterial(this.name, this._scene);
    BABYLON.Tags.AddTagsTo(mat, MATERIAL_BY_SCSS);

    if (this.style.diffuseColor) {
      const color = this.style._getPropertyValue('diffuse-color').toColor();
      if (color) {
        mat.diffuseColor = new BABYLON.Color3(color.r / 255.0, color.g / 255.0, color.b / 255.0);
      }
    }
    if (this.style.wireframe) {
      const wireframe = this.style._getPropertyValue('wireframe').value;
      mat.wireframe = wireframe === 'yes';
    }
  }
}
