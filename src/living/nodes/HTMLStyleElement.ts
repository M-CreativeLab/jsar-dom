import { NativeDocument } from '../../impl-interfaces';
import { documentBaseURL } from '../helpers/document-base-url';
import { asciiCaseInsensitiveMatch } from '../helpers/strings';
import { createStylesheet, removeStylesheet } from '../helpers/stylesheets';
import { childTextContent } from '../helpers/text';
import { HTMLElementImpl } from './HTMLElement';

export default class HTMLStyleElementImpl extends HTMLElementImpl implements HTMLStyleElement {
  disabled: boolean;
  media: string;
  type: string;
  sheet: CSSStyleSheet;
  _isOnStackOfOpenElements = false;

  constructor(
    hostObject: NativeDocument,
    args: any[],
    privateData: any
  ) {
    super(hostObject, args, {
      localName: 'style',
    });

    this.sheet = null;
  }

  _attach() {
    super._attach();
    if (!this._isOnStackOfOpenElements) {
      this._updateAStyleBlock();
    }
  }

  _updateAStyleBlock() {
    if (this.sheet) {
      removeStylesheet(this.sheet, this);
    }

    // Browsing-context connected, per https://github.com/whatwg/html/issues/4547
    if (!this.isConnected || !this._ownerDocument._defaultView) {
      return;
    }

    const type = this.getAttributeNS(null, "type");
    if (type !== null && type !== "" && !asciiCaseInsensitiveMatch(type, "text/css")) {
      return;
    }

    // Not implemented: CSP

    const content = childTextContent(this);
    // Not implemented: a bunch of other state, e.g. title/media attributes
    createStylesheet(content, this, documentBaseURL(this._ownerDocument));
  }
}
