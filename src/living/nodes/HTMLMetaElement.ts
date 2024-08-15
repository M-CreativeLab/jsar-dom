import { NativeDocument } from '../../impl-interfaces';
import { HTMLElementImpl } from './HTMLElement';

class ViewportMeta {
  width: number;
  height: number;
  initialScale: number;
  maximumScale: number;
  minimumScale: number;
  userScalable: boolean;
  // Added by XSML
  depth: number;
  boundingSize: number;

  static Parse(input: string): ViewportMeta {
    const viewport = new ViewportMeta();
    const parts = input.split(',');
    for (const part of parts) {
      const [key, value] = part.split('=');
      switch (key.trim()) {
        case 'width':
          viewport.width = parseFloat(value);
          break;
        case 'height':
          viewport.height = parseFloat(value);
          break;
        case 'initial-scale':
          viewport.initialScale = parseFloat(value);
          break;
        case 'maximum-scale':
          viewport.maximumScale = parseFloat(value);
          break;
        case 'minimum-scale':
          viewport.minimumScale = parseFloat(value);
          break;
        case 'user-scalable':
          viewport.userScalable = value === 'yes';
          break;
        case 'bounding-size':
          viewport.boundingSize = parseFloat(value);
          break;
        case 'depth':
          viewport.depth = parseFloat(value);
          break;
      }
    }
    return viewport;
  }
}

export default class HTMLMetaElementImpl extends HTMLElementImpl implements HTMLMetaElement {
  content: string;
  httpEquiv: string;
  media: string;
  name: string;
  scheme: string;

  constructor(
    nativeDocument: NativeDocument,
    args,
    _privateData: {} = null
  ) {
    super(nativeDocument, args, {
      localName: 'meta',
    });
  }

  _attach(): void {
    super._attach();
    this.content = this.getAttribute('content');
    this.httpEquiv = this.getAttribute('http-equiv');
    this.media = this.getAttribute('media');
    this.name = this.getAttribute('name');
    this.scheme = this.getAttribute('scheme');

    if (this.name === 'viewport') {
      this.#updateForViewport(this.content);
    }
  }

  #updateForViewport(input: string) {
    if (!input) {
      return;
    }
    const viewportConfig = ViewportMeta.Parse(input);
    this._ownerDocument.addEventListener('load', () => {
      const spaceTransform = this._ownerDocument.space.asNativeType<BABYLON.TransformNode>();
      const recommendedContentSize = this._hostObject.getRecommendedBoudingSize?.() || 1.0;
      const targetSize = viewportConfig.boundingSize * recommendedContentSize;
      this.#fitTo(spaceTransform, targetSize);
    });
  }

  #fitTo(node: BABYLON.TransformNode, targetSize: number) {
    const boundingVectors = node.getHierarchyBoundingVectors(true);
    const totalSize = boundingVectors.max.subtract(boundingVectors.min);
    const scalingFactor = Math.min(targetSize / totalSize.x, targetSize / totalSize.y, targetSize / totalSize.z);
    node.scaling.multiplyInPlace(new BABYLON.Vector3(scalingFactor, scalingFactor, scalingFactor));
    console.log('Fitting to', targetSize, totalSize, scalingFactor);
  }
}
