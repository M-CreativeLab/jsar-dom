import DOMException from '../domexception';
import NodeTypes, { isDocumentNode, isElementNode } from '../node-type';
import type { NodeImpl } from './Node';
import { NodeListImpl } from './NodeList';
import HTMLCollectionImpl from './HTMLCollection';
import type { SpatialDocumentImpl } from './SpatialDocument';
import { domSymbolTree } from '../helpers/internal-constants';
import { addNwsapi } from '../helpers/selectors';
import { convertNodesIntoNode } from '../node';
import { isShadowRoot } from '../helpers/shadow-dom';

function shouldAlwaysSelectNothing(elImpl: NodeImpl) {
  // This is true during initialization.
  if (elImpl === elImpl._ownerDocument) {
    return !(elImpl as SpatialDocumentImpl).documentElement;
  } else {
    return false;
  }
}

/**
 * Check if a node is a `SpatialDocumentImpl` instance.
 * 
 * Here we don't use `instanceof` because it will cause circular dependency.
 */
function isSpatialDocument(node: Node): node is SpatialDocumentImpl {
  return node.nodeType === NodeTypes.DOCUMENT_NODE;
}

export default interface ParentNodeImpl extends NodeImpl { };
export default class ParentNodeImpl implements ParentNode {
  protected _childrenList: HTMLCollectionImpl | null = null;

  get children(): HTMLCollection {
    if (!this._childrenList) {
      this._childrenList = new HTMLCollectionImpl(this._hostObject, [], {
        element: this,
        query: () => domSymbolTree.childrenToArray(this, {
          filter: node => node.nodeType === NodeTypes.ELEMENT_NODE
        })
      });
    } else {
      this._childrenList._update();
    }
    return this._childrenList;
  }

  get firstElementChild(): Element | null {
    for (const child of domSymbolTree.childrenIterator(this)) {
      if (child.nodeType === NodeTypes.ELEMENT_NODE) {
        return child;
      }
    }
    return null;
  }

  get lastElementChild(): Element | null {
    for (const child of domSymbolTree.childrenIterator(this, { reverse: true })) {
      if (child.nodeType === NodeTypes.ELEMENT_NODE) {
        return child;
      }
    }
    return null;
  }

  get childElementCount(): number {
    return this.children.length;
  }

  append(...nodes: (string | Node)[]): void {
    this._append(convertNodesIntoNode(this._ownerDocument, nodes) as NodeImpl);
  }

  prepend(...nodes: (string | Node)[]): void {
    // this._preInsert(convertNodesIntoNode(this._ownerDocument, nodes), this.firstChild as NodeImpl);
  }

  querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K];
  querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K];
  querySelector<K extends keyof MathMLElementTagNameMap>(selectors: K): MathMLElementTagNameMap[K];
  querySelector<K extends keyof HTMLElementDeprecatedTagNameMap>(selectors: K): HTMLElementDeprecatedTagNameMap[K];
  querySelector<E extends Element = Element>(selectors: string): E;
  querySelector(selectors: unknown): Element | null {
    if (
      !isElementNode(this) &&
      !isShadowRoot(this) &&
      !isSpatialDocument(this)
    ) {
      throw new DOMException('ParentNode must be an Element, ShadowRoot or Document.', 'HIERARCHY_REQUEST_ERR');
    }
    if (shouldAlwaysSelectNothing(this)) {
      return null;
    }
    const matcher = addNwsapi(this);
    return matcher.first(selectors as string, this);
  }

  querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
  querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
  querySelectorAll<K extends keyof MathMLElementTagNameMap>(selectors: K): NodeListOf<MathMLElementTagNameMap[K]>;
  querySelectorAll<K extends keyof HTMLElementDeprecatedTagNameMap>(selectors: K): NodeListOf<HTMLElementDeprecatedTagNameMap[K]>;
  querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
  querySelectorAll(selectors: unknown): NodeListOf<Element> {
    if (
      !isElementNode(this) &&
      !isShadowRoot(this) &&
      !isSpatialDocument(this)
    ) {
      throw new DOMException('ParentNode must be an Element, ShadowRoot or Document.', 'HIERARCHY_REQUEST_ERR');
    }
    if (shouldAlwaysSelectNothing(this)) {
      return new NodeListImpl(this._hostObject, [], {
        nodes: [],
      });
    }
    const matcher = addNwsapi(this);
    const list = matcher.select(selectors as string, this as Document);
    return new NodeListImpl(this._hostObject, [], {
      nodes: list,
    });
  }

  replaceChildren(...nodes: (string | Node)[]): void {
    const node = convertNodesIntoNode<NodeImpl>(this._ownerDocument, nodes);
    this._preInsertValidity(node, null);
    this._replaceAll(node);
  }
}
