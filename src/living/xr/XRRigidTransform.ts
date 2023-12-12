import DOMExceptionImpl from '../domexception';
import DOMPointReadOnlyImpl from '../geometry/DOMPointReadOnly';

export default class XRRigidTransformImpl implements XRRigidTransform {
  _position: DOMPointReadOnlyImpl = new DOMPointReadOnlyImpl(0, 0, 0, 1);
  _orientation: DOMPointReadOnlyImpl = new DOMPointReadOnlyImpl(0, 0, 0, 1);
  _matrix: Float32Array = new Float32Array(16);

  get position(): DOMPointReadOnly {
    return this._position;
  }

  get orientation(): DOMPointReadOnly {
    return this._orientation;
  }

  get matrix(): Float32Array {
    return this._matrix;
  }

  get inverse(): XRRigidTransform {
    throw new DOMExceptionImpl('Method not implemented.', 'NOT_SUPPORTED_ERR');
  }

  constructor(position?: DOMPointInit, orientation?: DOMPointInit) {
    if (position) {
      this._position = new DOMPointReadOnlyImpl(position.x, position.y, position.z, position.w);
    }
    if (orientation) {
      this._orientation = new DOMPointReadOnlyImpl(orientation.x, orientation.y, orientation.z, orientation.w);
    }
  }
}
