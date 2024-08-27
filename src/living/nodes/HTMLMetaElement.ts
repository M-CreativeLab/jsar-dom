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
          if (value === 'auto') {
            viewport.boundingSize = 1.0;
          } else if (value === 'unlimited') {
            viewport.boundingSize = Infinity;
          } else {
            viewport.boundingSize = parseFloat(value);
          }
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
    if (viewportConfig.boundingSize === Infinity) {
      this._ownerDocument._disableSpaceFitting = true;
    } else {
      this._ownerDocument._spaceViewportBoundingSize = viewportConfig.boundingSize;
    }
  }
}
