import { NativeDocument } from '../../impl-interfaces';
import { documentBaseURL } from '../helpers/document-base-url';
import { asciiCaseInsensitiveMatch } from '../helpers/strings';
import { createStylesheet, removeStylesheet } from '../helpers/stylesheets';
import { childTextContent } from '../helpers/text';
import { HTMLElementImpl } from './HTMLElement';

const supportedTypes = ['text/scss', 'text/css'];

export default class HTMLStyleElementImpl extends HTMLElementImpl implements HTMLStyleElement {
  disabled: boolean;
  media: string;
  sheet: CSSStyleSheet = null;
  _isOnStackOfOpenElements = false;

  constructor(
    hostObject: NativeDocument,
    args: any[],
    privateData: {} = null
  ) {
    super(hostObject, args, {
      localName: 'style',
    });
  }

  get type(): string {
    return this.getAttribute('type') || supportedTypes[0];
  }
  set type(value: string) {
    this.setAttribute('type', value);
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

    // If this is disabled, don't do anything.
    if (this.disabled) {
      return;
    }

    const type = this.type;
    if (!asciiCaseInsensitiveMatch(type, 'text/css') && !asciiCaseInsensitiveMatch(type, 'text/scss')) {
      /**
       * Just returns if the type is not supported (SCSS or CSS).
       */
      return;
    }

    // Not implemented: CSP

    const content = childTextContent(this);
    // Not implemented: a bunch of other state, e.g. title/media attributes
    createStylesheet(content, this, documentBaseURL(this._ownerDocument));
  }
}
