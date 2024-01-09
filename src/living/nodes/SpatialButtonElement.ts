import { NativeDocument } from '../../impl-interfaces';
import { SpatialElement } from './SpatialElement';

export default class SpatialButtonElement extends SpatialElement {
  constructor(
    hostObject: NativeDocument,
    args,
    _privateData: {} = null,
  ) {
    super(hostObject, args, {
      localName: 'button3d',
    });
  }

  _attach(): void {
    const nameOrId = this._getInternalNodeNameOrId();
    const container = BABYLON.MeshBuilder.CreatePlane(nameOrId, {
      width: 0.5,
      height: 0.5,
    });
    const mesh = BABYLON.MeshBuilder.CreateBox(`${nameOrId}#mesh`, {
      ...this._getCommonMeshBuilderOptions(),
      width: 0.5,
      height: 0.5,
      depth: 0.01,
    }, this._scene);
    mesh.position.z = 0.01;
    mesh.parent = container;
    super._attach(container);

    const shadowRoot = this.attachShadow({ mode: 'open' });
    const style = this._ownerDocument.createElement('style');
    style.type = 'text/css';
    style.textContent = `
      section {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      section > div {
        height: 100px;
        font-size: 120px;
      }
    `;
    shadowRoot.appendChild(style);

    // Update the 2D DOM.
    {
      const container2d = this._ownerDocument.createElement('section');
      const button = this._ownerDocument.createElement('div');
      button.textContent = this.textContent;
      container2d.appendChild(button);
      shadowRoot.appendChild(container2d);

      const originalScaling = mesh.scaling.clone();
      container2d.addEventListener('mousedown', () => {
        mesh.scaling.multiplyInPlace(new BABYLON.Vector3(0.95, 0.95, 0.95));
      });
      container2d.addEventListener('mouseup', () => {
        this.dispatchEvent(new Event('click')); // dispatch "click" event.
        mesh.scaling = originalScaling.clone();
      });
    }
  }
}
