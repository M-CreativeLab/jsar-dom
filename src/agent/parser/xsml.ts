import { XMLParser } from 'fast-xml-parser';
import { toNode } from './xml-utils';
import { SpatialDocumentImpl } from '../../living/nodes/SpatialDocument';
import { TextImpl } from '../../living/nodes/Text';

class XSMLParser {
  xmlParser: XMLParser;

  constructor() {
    this.xmlParser = new XMLParser({
      preserveOrder: true,
      ignoreAttributes: false,
      unpairedTags: ['link', 'meta'],
      stopNodes: ['*.pre', '*.script'],
      processEntities: true,
      htmlEntities: true,
    });
  }

  parseIntoDocument(markup: string, ownerDocument: SpatialDocumentImpl) {
    const parsedDocument = this.xmlParser.parse(markup);
    if (parsedDocument.length > 1) {
      throw new TypeError('Invalid XSML document, only one <xsml> tag is allowed.');
    }
    if (!parsedDocument[0].xsml) {
      throw new TypeError('Invalid XSML document, the root tag must be <xsml>.');
    }

    const xsmlNode = toNode(parsedDocument[0]);
    const xsmlElement = this.#createElement(xsmlNode, ownerDocument, ownerDocument);
    ownerDocument._xsmlVersion = xsmlNode.attrs.version;

    // Traverse the tree and create the DOM.
    this.#traverse(xsmlNode, xsmlElement, ownerDocument);
    
  }

  #createElement(node: ReturnType<typeof toNode>, parent: Document | Element, ownerDocument: Document): HTMLElement {
    // TODO: handle custom-element creation.

    const element = ownerDocument.createElement(node.name);
    // adopt the attributes.
    for (const [key, value] of Object.entries(node.attrs)) {
      element.setAttribute(key, value);
    }
    parent.appendChild(element);

    // handle the text content
    if (node.text) {
      const textNode = new TextImpl((ownerDocument as unknown as SpatialDocumentImpl)._hostObject, [], {
        data: node.text,
      });
      parent.appendChild(textNode);
    }
    return element;
  }

  #traverse(node: ReturnType<typeof toNode>, parent: Document | Element, ownerDocument: Document) {
    if (!Array.isArray(node.children)) {
      return;
    }
    for (const child of node.children) {
      const childNode = toNode(child);
      const element = this.#createElement(childNode, parent, ownerDocument);
      this.#traverse(childNode, element, ownerDocument);
    }
  }
}

export function parseIntoDocument(markup: string, ownerDocument: SpatialDocumentImpl) {
  const parser = new XSMLParser();
  parser.parseIntoDocument(markup, ownerDocument);
}
