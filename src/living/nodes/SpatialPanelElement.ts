import { NativeDocument } from '../../impl-interfaces';
import CSSSpatialStyleDeclaration from '../cssom/CSSSpatialStyleDeclaration';
import { isSpatialElement } from '../node-type';
import { NodeImpl } from './Node';
import { SpatialElement } from './SpatialElement';

export default class SpatialPanelElement extends SpatialElement {
  private _isArranged: boolean = false;

  constructor(
    hostObject: NativeDocument,
    args,
    _privateData: {} = null,
  ) {
    super(hostObject, args, {
      localName: 'panel',
    });
  }

  get margin(): number {
    return parseFloat(this.getAttribute('margin')) || 0;
  }
  set margin(value: number) {
    this.setAttribute('margin', `${value}`);
  }

  get orientation(): 'vertical' | 'horizontal' {
    return this.getAttribute('orientation') as 'vertical' | 'horizontal';
  }
  set orientation(value: 'vertical' | 'horizontal') {
    this.setAttribute('orientation', value);
  }

  _attach(): void {
    super._attach(
      new BABYLON.TransformNode(this._getInternalNodeNameOrId(), this._scene)
    );
  }

  _adoptStyle(style: CSSSpatialStyleDeclaration): void {
    super._adoptStyle(style);
    this._arrangeChildren();
  }

  private _arrangeChildren(): void {
    if (this._isArranged === true) {
      return;
    }

    let width = 0;
    let height = 0;
    let controlCount = 0;
    const extendSizes = [];

    const currentInverseWorld = BABYLON.Matrix.Invert(this._internalObject!.computeWorldMatrix(true));
    const children = this.children;
    // Measure
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (!isSpatialElement(child)) {
        continue;
      }
      const nativeHandle = child.asNativeType();
      if (!(nativeHandle instanceof BABYLON.AbstractMesh)) {
        continue;
      }

      controlCount++;
      nativeHandle.computeWorldMatrix(true);
      nativeHandle.getWorldMatrix().multiplyToRef(currentInverseWorld, BABYLON.TmpVectors.Matrix[0]);

      const boundingBox = nativeHandle.getBoundingInfo().boundingBox;
      const extendSize = BABYLON.Vector3.TransformNormal(boundingBox.extendSize, BABYLON.TmpVectors.Matrix[0]);
      extendSizes.push(extendSize);

      if (this.orientation === 'vertical') {
        height += extendSize.y;
      } else {
        width += extendSize.x;
      }
    }

    if (this.orientation === 'vertical') {
      height += ((controlCount - 1) * this.margin) / 2;
    } else {
      width += ((controlCount - 1) * this.margin) / 2;
    }

    // Arrange
    let offset: number;
    if (this.orientation === 'vertical') {
      offset = -height;
    } else {
      offset = -width;
    }

    let index = 0;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (!isSpatialElement(child)) {
        continue;
      }
      const nativeHandle = child.asNativeType();
      if (!(nativeHandle instanceof BABYLON.AbstractMesh)) {
        continue;
      }

      controlCount--;
      const extendSize = extendSizes[index++];

      if (this.orientation === 'vertical') {
        nativeHandle.position.y = offset + extendSize.y;
        nativeHandle.position.x = 0;
        offset += extendSize.y * 2;
      } else {
        nativeHandle.position.x = offset + extendSize.x;
        nativeHandle.position.y = 0;
        offset += extendSize.x * 2;
      }
      offset += controlCount > 0 ? this.margin : 0;
    }

    // this._isArranged = true;
  }
}
