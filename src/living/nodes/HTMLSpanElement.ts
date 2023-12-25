import { NativeDocument } from '../../impl-interfaces';
import { HTMLContentElement } from './HTMLContentElement';

export default class HTMLSpanElementImpl extends HTMLContentElement implements HTMLSpanElement {
  constructor(
    nativeDocument: NativeDocument,
    args,
    _privateData: {} = null
  ) {
    super(nativeDocument, args, {
      localName: 'span',
    });

    this._adoptedStyle.flexDirection = 'row';
  }
}
