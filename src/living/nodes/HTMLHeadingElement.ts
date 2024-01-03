import { NativeDocument } from '../../impl-interfaces';
import { HTMLContentElement } from './HTMLContentElement';

export default class HTMLHeadingElementImpl extends HTMLContentElement implements HTMLHeadingElement {
  align: string;

  constructor(
    nativeDocument: NativeDocument,
    args,
    privateData: {
      level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    }
  ) {
    super(nativeDocument, args, {
      localName: privateData.level,
    });
    this._adoptedStyle.display = 'block';
    this._adoptedStyle.textAlign = 'left';
    this._adoptedStyle.lineHeight = '1.5';
    this._adoptedStyle.fontWeight = 'bold';

    switch (privateData.level) {
      case 'h1':
        this._adoptedStyle.fontSize = '50%';
        this._adoptedStyle.margin = '2% 0';
        break;
      case 'h2':
        this._adoptedStyle.fontSize = '47%';
        this._adoptedStyle.margin = '2% 0';
        break;
      case 'h3':
        this._adoptedStyle.fontSize = '45%';
        this._adoptedStyle.margin = '2% 0';
        break;
      case 'h4':
        this._adoptedStyle.fontSize = '42%';
        this._adoptedStyle.margin = '2% 0';
        break;
      case 'h5':
        this._adoptedStyle.fontSize = '40%';
        this._adoptedStyle.margin = '2% 0';
        break;
      case 'h6':
        this._adoptedStyle.fontSize = '37%';
        this._adoptedStyle.margin = '2% 0';
        break;
    }
  }
}
