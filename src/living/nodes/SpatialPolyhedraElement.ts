import { NativeDocument } from '../../impl-interfaces';
import { SpatialElement } from './SpatialElement';

const PolyhedraNameToTypeIdMap = {
  'tetrahedron': 0,
  'octahedron': 1,
  'dodecahedron': 2,
  'icosahedron': 3,
  'rhombicuboctahedron': 4,
  'triangular-prism': 5,
  'pentagonal-prism': 6,
  'hexagonal-prism': 7,
  'square-pyramid': 8,
  'pentagonal-pyramid': 9,
  'triangular-dipyramid': 10,
  'pentagonal-dipyramid': 11,
  'elongated-square-dipyramid': 12,
  'elongated-pentagonal-dipyramid': 13,
  'elongated-pentagonal-cupola': 14,
} as const;
type PolyhedraType = keyof (typeof PolyhedraNameToTypeIdMap);

export default class SpatialPolyhedraElement extends SpatialElement {
  constructor(
    hostObject: NativeDocument,
    args,
    _privateData: {} = null,
  ) {
    super(hostObject, args, {
      localName: 'polyhedra',
    });
  }

  get type(): PolyhedraType {
    const attrType = this.getAttribute('type');
    if (!Object.hasOwn(PolyhedraNameToTypeIdMap, attrType)) {
      return 'tetrahedron';
    } else {
      return attrType as PolyhedraType;
    }
  }
  set type(value: PolyhedraType) {
    this._setSpatialAttribute('type', value);
  }

  get sizeX(): number {
    return parseFloat(this.getAttribute('size-x'));
  }
  set sizeX(value: number) {
    this._setSpatialAttribute('size-x', value);
  }

  get sizeY(): number {
    return parseFloat(this.getAttribute('size-y'));
  }
  set sizeY(value: number) {
    this._setSpatialAttribute('size-y', value);
  }

  get sizeZ(): number {
    return parseFloat(this.getAttribute('size-z'));
  }
  set sizeZ(value: number) {
    this._setSpatialAttribute('size-z', value);
  }

  get size(): number {
    return parseFloat(this.getAttribute('size'));
  }
  set size(value: number) {
    this._setSpatialAttribute('size', value);
  }

  _attach(): void {
    super._attach(
      BABYLON.MeshBuilder.CreatePolyhedron(this._getInternalNodeNameOrId(), {
        type: PolyhedraNameToTypeIdMap[this.type],
        size: this.size,
        sizeX: this.sizeX,
        sizeY: this.sizeY,
        sizeZ: this.sizeZ,
      }, this._scene)
    );
  }
}
