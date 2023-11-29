import { NativeDocument } from '../../impl-interfaces';
import { HTMLElementImpl } from './HTMLElement';

export default class HTMLSpanElementImpl extends HTMLElementImpl implements HTMLSpanElement {
  constructor(
    nativeDocument: NativeDocument,
    args,
    privateData: {} = null
  ) {
    super(nativeDocument, args, {
      localName: 'span',
    });
  }
}
