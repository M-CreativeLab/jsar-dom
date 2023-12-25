import { NativeDocument } from '../../impl-interfaces';
import { HTMLContentElement } from './HTMLContentElement';

export default class HTMLDivElementImpl extends HTMLContentElement implements HTMLDivElement {
  align: string;

  constructor(
    nativeDocument: NativeDocument,
    args,
    privateData: {} = null
  ) {
    super(nativeDocument, args, {
      localName: 'div',
    });

    this._adoptedStyle.flexDirection = 'column';
  }
}
