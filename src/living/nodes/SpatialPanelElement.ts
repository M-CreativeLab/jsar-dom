import { NativeDocument } from '../../impl-interfaces';
import CSSSpatialStyleDeclaration from '../cssom/CSSSpatialStyleDeclaration';
import { isSpatialElement } from '../node-type';
import { SpatialElement } from './SpatialElement';

export default class SpatialPanelElement extends SpatialElement {
  private _isArranged: boolean = false;
  /**
   * Volume-based panel members
   */
  private _rowThenColumn = true;
  private _volumeBasedOrientation: 'origin' | 'origin-reversed' | 'forward' | 'forward-reversed' | 'unset' = 'origin';
  private _cellWidth: number;
  private _cellHeight: number;

  constructor(
    hostObject: NativeDocument,
    args,
    _privateData: {} = null,
  ) {
    super(hostObject, args, {
      localName: 'panel',
    });
  }

  get type(): 'stack' | 'cylinder' | 'sphere' {
    return this.getAttribute('type') as 'stack' | 'cylinder' | 'sphere';
  }
  set type(value: 'stack' | 'cylinder' | 'sphere') {
    this.setAttribute('type', value);
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

  get rows(): number {
    if (!this.hasAttribute('rows')) {
      return 0;
    }
    const rows = parseInt(this.getAttribute('rows'));
    if (isNaN(rows)) {
      return 0;
    } else {
      return rows;
    }
  }
  set rows(value: number) {
    this.setAttribute('rows', `${value}`);
    this._rowThenColumn = false;
  }

  get columns(): number {
    if (!this.hasAttribute('columns')) {
      return 10.0;
    }
    const rows = parseInt(this.getAttribute('columns'));
    if (isNaN(rows)) {
      return 10.0;
    } else {
      return rows;
    }
  }
  set columns(value: number) {
    this.setAttribute('columns', `${value}`);
    this._rowThenColumn = true;
  }

  get radius(): number {
    if (!this.hasAttribute('radius')) {
      return 5.0;
    }
    const rows = parseInt(this.getAttribute('radius'));
    if (isNaN(rows)) {
      return 5.0;
    } else {
      return rows;
    }
  }
  set radius(value: number) {
    this.setAttribute('radius', `${value}`);
  }

  _attach(): void {
    super._attach(
      new BABYLON.TransformNode(this._getInternalNodeNameOrId(), this._scene)
    );
  }

  _adoptStyle(style: CSSSpatialStyleDeclaration): void {
    super._adoptStyle(style);

    switch (this.type) {
      case 'stack':
        this._arrangeChildrenInStackLayout();
        break;
      case 'cylinder':
      case 'sphere':
        this._arrangeChildrenInVolumeLayout();
        break;
      default:
        break;
    }
  }

  private _arrangeChildrenInStackLayout(): void {
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
  }

  private _arrangeChildrenInVolumeLayout(): void {
    this._cellWidth = 0;
    this._cellHeight = 0;

    let rows = 0;
    let columns = 0;
    let controlCount = 0;

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

      const boundingBox = nativeHandle.getHierarchyBoundingVectors();
      const extendSize = BABYLON.TmpVectors.Vector3[0];
      const diff = BABYLON.TmpVectors.Vector3[1];

      boundingBox.max.subtractToRef(boundingBox.min, diff);
      diff.scaleInPlace(0.5);
      BABYLON.Vector3.TransformNormalToRef(diff, currentInverseWorld, extendSize);

      this._cellWidth = Math.max(this._cellWidth, extendSize.x * 2);
      this._cellHeight = Math.max(this._cellHeight, extendSize.y * 2);
    }

    this._cellWidth += this.margin * 2;
    this._cellHeight += this.margin * 2;

    // Arrange
    if (this._rowThenColumn) {
      columns = this.columns;
      rows = Math.ceil(controlCount / this.columns);
    } else {
      rows = this.rows;
      columns = Math.ceil(controlCount / this.rows);
    }

    const startOffsetX = columns * 0.5 * this._cellWidth;
    const startOffsetY = rows * 0.5 * this._cellHeight;
    const nodeGrid = [];
    let cellCounter = 0;

    if (this._rowThenColumn) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          nodeGrid.push(
            new BABYLON.Vector3(
              c * this._cellWidth - startOffsetX + this._cellWidth / 2,
              r * this._cellHeight - startOffsetY + this._cellHeight / 2,
              0
            )
          );
          cellCounter++;
          if (cellCounter > controlCount) {
            break;
          }
        }
      }
    } else {
      for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows; r++) {
          nodeGrid.push(
            new BABYLON.Vector3(
              c * this._cellWidth - startOffsetX + this._cellWidth / 2,
              r * this._cellHeight - startOffsetY + this._cellHeight / 2,
              0
            )
          );
          cellCounter++;
          if (cellCounter > controlCount) {
            break;
          }
        }
      }
    }

    cellCounter = 0;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (!isSpatialElement(child)) {
        continue;
      }
      const nativeHandle = child.asNativeType();
      if (!(nativeHandle instanceof BABYLON.AbstractMesh)) {
        continue;
      }

      this._mapGridNode(child, nodeGrid[cellCounter]);
      cellCounter++;
    }
    this._finalProcessing();
  }

  private _mapGridNode(child: SpatialElement, position: BABYLON.Vector3): void {
    const mesh = child.asNativeType();
    if (!mesh || !(mesh instanceof BABYLON.AbstractMesh)) {
      return;
    }

    let newPos: BABYLON.Vector3;
    switch (this.type) {
      case 'sphere':
        newPos = this._sphericalMapping(position);
        break;
      case 'cylinder':
        newPos = this._cylindricalMapping(position);
        break;
    }

    mesh.position = newPos;
    switch (this._volumeBasedOrientation) {
      case 'origin':
        mesh.lookAt(new BABYLON.Vector3(2 * newPos.x, newPos.y * (this.type === 'sphere' ? 2 : 1), 2 * newPos.z));
        break;
      case 'origin-reversed':
        mesh.lookAt(new BABYLON.Vector3(-newPos.x, newPos.y, -newPos.z));
        break;
      case 'forward':
        break;
      case 'forward-reversed':
        mesh.rotate(BABYLON.Axis.Y, Math.PI, BABYLON.Space.LOCAL);
        break;
    }
  }

  private _finalProcessing(): void {
    // TODO
  }

  private _cylindricalMapping(source: BABYLON.Vector3) {
    const newPos = new BABYLON.Vector3(0, source.y, this.radius);
    const yAngle = source.x / this.radius;
    BABYLON.Matrix.RotationYawPitchRollToRef(yAngle, 0, 0, BABYLON.TmpVectors.Matrix[0]);
    return BABYLON.Vector3.TransformNormal(newPos, BABYLON.TmpVectors.Matrix[0]);
  }

  private _sphericalMapping(source: BABYLON.Vector3) {
    const newPos = new BABYLON.Vector3(0, 0, this.radius);
    const xAngle = source.y / this.radius;
    const yAngle = -(source.x / this.radius);
    BABYLON.Matrix.RotationYawPitchRollToRef(yAngle, xAngle, 0, BABYLON.TmpVectors.Matrix[0]);
    return BABYLON.Vector3.TransformNormal(newPos, BABYLON.TmpVectors.Matrix[0]);
  }
}
