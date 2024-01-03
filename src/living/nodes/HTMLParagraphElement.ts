import { NativeDocument } from '../../impl-interfaces';
import { HTMLContentElement } from './HTMLContentElement';

export default class HTMLParagraphElementImpl extends HTMLContentElement implements HTMLParagraphElement {
  align: string;

  constructor(
    nativeDocument: NativeDocument,
    args,
    _privateData: {} = null
  ) {
    super(nativeDocument, args, {
      localName: 'p',
    });
    this._adoptedStyle.display = 'block';
    this._adoptedStyle.textAlign = 'left';
    this._adoptedStyle.lineHeight = '1.2';
    this._adoptedStyle.margin = '1% 0';
    this._adoptedStyle.fontSize = '30%';
  }
}
