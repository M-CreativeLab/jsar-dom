import { NativeDocument } from '../../impl-interfaces';
import { fallbackBaseURL } from '../helpers/document-base-url';
import { HTMLElementImpl } from './HTMLElement';

export default class HTMLBaseElementImpl extends HTMLElementImpl implements HTMLBaseElement {
  constructor(
    nativeDocument: NativeDocument,
    args,
    privateData: {} = null
  ) {
    super(nativeDocument, args, {
      localName: 'base',
    });
  }
  get href(): string {
    const document = this._ownerDocument;
    const url = this.hasAttributeNS(null, 'href') ? this.getAttributeNS(null, 'href') : '';
    const parsed = new URL(url, fallbackBaseURL(document));
    if (parsed === null) {
      return url;
    }
    return parsed.href;
  }
  set href(value: string) {
    this.setAttributeNS(null, 'href', value);
  }

  get target(): string {
    return this.getAttributeNS(null, 'target') || '';
  }
}
