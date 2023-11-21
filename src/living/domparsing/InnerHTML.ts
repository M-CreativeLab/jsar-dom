import { HTML_NS } from '../helpers/namespaces';
import { isShadowRoot } from '../helpers/shadow-dom';
import { ElementImpl } from '../nodes/Element';
import { NodeImpl } from '../nodes/Node';
import { fragmentSerialization } from './serialization';

// https://w3c.github.io/DOM-Parsing/#the-innerhtml-mixin
export default class InnerHTMLImpl implements InnerHTML {
  // https://w3c.github.io/DOM-Parsing/#dom-innerhtml-innerhtml
  get innerHTML() {
    if (!(this instanceof ElementImpl)) {
      throw new TypeError("innerHTML is only implemented on Element");
    }

    return fragmentSerialization(this, {
      outer: false,
      requireWellFormed: true,
      globalObject: this._hostObject,
    });
  }

  set innerHTML(markup: string) {
    if (!(this instanceof ElementImpl)) {
      throw new TypeError('innerHTML is only implemented on Element');
    }

    const contextElement = isShadowRoot(this) ? this.host : this;
    const fragment = parseFragment(markup, contextElement);

    let contextObject = this;
    if (this.nodeType === NodeImpl.ELEMENT_NODE && this.localName === 'template' && this.namespaceURI === HTML_NS) {
      contextObject = this._templateContents;
    }
    contextObject._replaceAll(fragment);
  }
}
