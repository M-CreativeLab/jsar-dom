import DOMException from 'domexception';
import { domSymbolTree } from '../helpers/internal-constants';
import { clone, isInclusiveAncestor, nodeRoot } from '../helpers/node';
import { setAnExistingAttributeValue } from '../attributes';
import { assignSlot, assignSlotable, assignSlotableForTree, isShadowRoot, isSlot, shadowIncludingRoot, signalSlotChange } from '../helpers/shadow-dom';
import type { BaseWindowImpl } from '../../agent/window';
import type { AttrImpl } from '../attributes/Attr';
import type { ElementImpl } from './Element';
import { simultaneousIterators } from '../../utils';
import { NodeListImpl } from './NodeList';
import { ShadowRootImpl } from './ShadowRoot';
import type { RangeImpl } from '../range/Range';
import type CharacterDataImpl from './CharacterData';
import type { NativeDocument } from '../../impl-interfaces';
import type { SpatialDocumentImpl } from './SpatialDocument';
import NodeTypes from '../node-type';
import { queueTreeMutationRecord } from '../helpers/mutation-observers';
import { invalidateStyleCache } from '../helpers/style-rules';
import { documentBaseURLSerialized } from '../helpers/document-base-url';

function nodeEquals(a: Node, b: Node) {
  if (a.nodeType !== b.nodeType) {
    return false;
  }
  switch (a.nodeType) {
    case NodeImpl.DOCUMENT_TYPE_NODE:
      const docTypeA = a as DocumentType;
      const docTypeB = b as DocumentType;
      if (docTypeA.name !== docTypeB.name || docTypeA.publicId !== docTypeB.publicId ||
        docTypeA.systemId !== docTypeB.systemId) {
        return false;
      }
      break;
    case NodeImpl.ELEMENT_NODE:
      const elementA = a as Element;
      const elementB = b as Element;
      if (elementA.namespaceURI !== elementB.namespaceURI || elementA.prefix !== elementB.prefix || elementA.localName !== elementB.localName ||
        elementA.attributes.length !== elementB.attributes.length) {
        return false;
      }
      break;
    case NodeImpl.ATTRIBUTE_NODE:
      const attrA = a as Attr;
      const attrB = b as Attr;
      if (attrA.namespaceURI !== attrB.namespaceURI || attrA.localName !== attrB.localName || attrA.value !== attrB.value) {
        return false;
      }
      break;
    case NodeImpl.PROCESSING_INSTRUCTION_NODE:
      const processingInstructionA = a as ProcessingInstruction;
      const processingInstructionB = b as ProcessingInstruction;
      if (processingInstructionA.target !== processingInstructionB.target || processingInstructionA.data !== processingInstructionB.data) {
        return false;
      }
      break;
    case NodeImpl.TEXT_NODE:
    case NodeImpl.COMMENT_NODE:
      const aAsCharacterData = a as CharacterDataImpl;
      const bAsCharacterData = b as CharacterDataImpl;
      if (aAsCharacterData._data !== bAsCharacterData._data) {
        return false;
      }
      return false;
  }

  if (a.nodeType === NodeImpl.ELEMENT_NODE) {
    const elementA = a as ElementImpl;
    const elementB = b as ElementImpl;
    if (!attributeListsEqual(elementA, elementB)) {
      return false;
    }
  }

  for (const nodes of simultaneousIterators(domSymbolTree.childrenIterator(a), domSymbolTree.childrenIterator(b))) {
    if (!nodes[0] || !nodes[1]) {
      // mismatch in the amount of childNodes
      return false;
    }
    if (!nodeEquals(nodes[0], nodes[1])) {
      return false;
    }
  }
  return true;
}

// Needed by https://dom.spec.whatwg.org/#concept-node-equals
function attributeListsEqual(elementA: ElementImpl, elementB: ElementImpl) {
  const listA = elementA._attributeList;
  const listB = elementB._attributeList;

  const lengthA = listA.length;
  const lengthB = listB.length;

  if (lengthA !== lengthB) {
    return false;
  }

  for (let i = 0; i < lengthA; ++i) {
    const attrA = listA[i];
    if (!listB.some(attrB => nodeEquals(attrA, attrB))) {
      return false;
    }
  }

  return true;
}

// https://dom.spec.whatwg.org/#concept-tree-host-including-inclusive-ancestor
function isHostInclusiveAncestor(nodeImplA: NodeImpl, nodeImplB: NodeImpl) {
  for (const ancestor of domSymbolTree.ancestorsIterator(nodeImplB)) {
    if (ancestor === nodeImplA) {
      return true;
    }
  }
  const rootImplB = nodeRoot(nodeImplB) as NodeImpl;
  if (rootImplB._host) {
    return isHostInclusiveAncestor(nodeImplA, rootImplB._host);
  }
  return false;
}

type ObserverItem = {
  observer: MutationObserver;
  options?: MutationObserverInit;
  source?: ObserverItem;
};

let globalIdByNode = 0;

export class NodeImpl extends EventTarget implements Node {
  /// Original NODE Types
  readonly ELEMENT_NODE: 1 = 1;
  static readonly ELEMENT_NODE: 1 = 1;
  readonly ATTRIBUTE_NODE: 2 = 2;
  static readonly ATTRIBUTE_NODE: 2 = 2;
  readonly TEXT_NODE: 3 = 3;
  static readonly TEXT_NODE: 3 = 3;
  readonly CDATA_SECTION_NODE: 4 = 4;
  static readonly CDATA_SECTION_NODE: 4 = 4;
  readonly ENTITY_REFERENCE_NODE: 5 = 5;
  static readonly ENTITY_REFERENCE_NODE: 5 = 5;
  readonly ENTITY_NODE: 6 = 6;
  static readonly ENTITY_NODE: 6 = 6;
  readonly PROCESSING_INSTRUCTION_NODE: 7 = 7;
  static readonly PROCESSING_INSTRUCTION_NODE: 7 = 7;
  readonly COMMENT_NODE: 8 = 8;
  static readonly COMMENT_NODE: 8 = 8;
  readonly DOCUMENT_NODE: 9 = 9;
  static readonly DOCUMENT_NODE: 9 = 9;
  readonly DOCUMENT_TYPE_NODE: 10 = 10;
  static readonly DOCUMENT_TYPE_NODE: 10 = 10;
  readonly DOCUMENT_FRAGMENT_NODE: 11 = 11;
  static readonly DOCUMENT_FRAGMENT_NODE: 11 = 11;
  readonly NOTATION_NODE: 12 = 12;
  static readonly NOTATION_NODE: 12 = 12;
  /**
   * A node that represents a spatial object, which contains: transform, mesh, light, etc.
   */
  readonly SPATIAL_OBJECT_NODE: 13 = 13;
  static readonly SPATIAL_OBJECT_NODE: 13 = 13;

  // Document positions
  readonly DOCUMENT_POSITION_DISCONNECTED: 1 = 1;
  static readonly DOCUMENT_POSITION_DISCONNECTED: 1 = 1;
  readonly DOCUMENT_POSITION_PRECEDING: 2 = 2;
  static readonly DOCUMENT_POSITION_PRECEDING: 2 = 2;
  readonly DOCUMENT_POSITION_FOLLOWING: 4 = 4;
  static readonly DOCUMENT_POSITION_FOLLOWING: 4 = 4;
  readonly DOCUMENT_POSITION_CONTAINS: 8 = 8;
  static readonly DOCUMENT_POSITION_CONTAINS: 8 = 8;
  readonly DOCUMENT_POSITION_CONTAINED_BY: 16 = 16;
  static readonly DOCUMENT_POSITION_CONTAINED_BY: 16 = 16;
  readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: 32 = 32;
  static readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: 32 = 32;

  nodeType: number;

  _version: number = 0;
  _attached = false;
  _hostObject: NativeDocument;
  _host: NodeImpl;
  _ownerDocument: SpatialDocumentImpl;
  _shadowRoot: ShadowRootImpl | null;
  _assignedSlot: HTMLSlotElement | null;
  _assignedNodes: Array<NodeImpl> = [];
  _referencedRanges = new Set<Range>();
  _registeredObserverList: Array<ObserverItem> = [];
  _memoizedQueries = {};
  _ceState: string;

  /**
   * The followings are used by inspector protocol
   */
  /** @internal */
  _inspectorId: number = globalIdByNode++;

  #children: NodeListImpl<ChildNode>;
  #childrenList: HTMLCollection = null;
  #assignedSlot: HTMLSlotElement;

  constructor(
    hostObject: NativeDocument,
    _args,
    privateData: {
      defaultView?: BaseWindowImpl
    } = null
  ) {
    super();

    this._hostObject = hostObject;
    if (hostObject != null) {
      this._ownerDocument = hostObject.attachedDocument;
    }
    domSymbolTree.initialize(this);

    /**
     * Add CDP Node if the implementation is available.
     */
    if (privateData?.defaultView) {
      privateData.defaultView._cdpImplementation?.addNode(this);
    } else {
      this._ownerDocument._defaultView._cdpImplementation?.addNode(this);
    }
  }

  #getTheParent(): Node {
    if (this.#assignedSlot) {
      return this.#assignedSlot;
    }
    return domSymbolTree.parent(this);
  }

  get baseURI(): string {
    return documentBaseURLSerialized(this._ownerDocument);
  }

  get parentNode(): ParentNode {
    return domSymbolTree.parent(this);
  }

  get nodeName(): string {
    switch (this.nodeType) {
      case NodeImpl.ELEMENT_NODE:
        return (this as unknown as Element).tagName;
      case NodeImpl.ATTRIBUTE_NODE:
        return (this as unknown as AttrImpl)._qualifiedName;
      case NodeImpl.TEXT_NODE:
        return '#text';
      case NodeImpl.CDATA_SECTION_NODE:
        return '#cdata-section';
      case NodeImpl.PROCESSING_INSTRUCTION_NODE:
        return (this as unknown as ProcessingInstruction).target;
      case NodeImpl.COMMENT_NODE:
        return '#comment';
      case NodeImpl.DOCUMENT_NODE:
        return '#document';
      case NodeImpl.DOCUMENT_TYPE_NODE:
        return (this as unknown as DocumentType).name;
      case NodeImpl.DOCUMENT_FRAGMENT_NODE:
        return '#document-fragment';
    }

    // should never happen
    return null;
  }

  get firstChild(): ChildNode {
    return domSymbolTree.firstChild(this) as ChildNode;
  }

  get lastChild(): ChildNode {
    return domSymbolTree.lastChild(this) as ChildNode;
  }

  get childNodes(): NodeListOf<ChildNode> {
    if (!this.#children) {
      this.#children = new NodeListImpl(this._hostObject, [], {
        element: this,
        query: () => domSymbolTree.childrenToArray(this)
      });
    } else {
      this.#children._update();
    }
    return this.#children;
  }

  // https://dom.spec.whatwg.org/#connected
  // https://dom.spec.whatwg.org/#dom-node-isconnected
  get isConnected(): boolean {
    const root = shadowIncludingRoot(this);
    return root && root.nodeType === NodeTypes.DOCUMENT_NODE;
  }

  get ownerDocument(): Document {
    return this.nodeType === NodeTypes.DOCUMENT_NODE ? null : this._ownerDocument;
  }

  get nextSibling(): ChildNode | null {
    return domSymbolTree.nextSibling(this);
  }

  get previousSibling(): ChildNode | null {
    return domSymbolTree.previousSibling(this);
  }

  get parentElement(): HTMLElement | null {
    const parentNode = domSymbolTree.parent(this);
    return parentNode !== null && parentNode.nodeType === NodeImpl.ELEMENT_NODE ? parentNode : null;
  }

  get nodeValue() {
    switch (this.nodeType) {
      case NodeImpl.ATTRIBUTE_NODE: {
        return (this as unknown as AttrImpl).value;
      }
      case NodeImpl.TEXT_NODE:
      case NodeImpl.CDATA_SECTION_NODE: // CDATASection is a subclass of Text
      case NodeImpl.PROCESSING_INSTRUCTION_NODE:
      case NodeImpl.COMMENT_NODE: {
        return (this as unknown as CharacterDataImpl)._data;
      }
      default: {
        return null;
      }
    }
  }

  set nodeValue(value) {
    if (value === null) {
      value = '';
    }

    switch (this.nodeType) {
      case NodeImpl.ATTRIBUTE_NODE: {
        setAnExistingAttributeValue(this as unknown as AttrImpl, value);
        break;
      }
      case NodeImpl.TEXT_NODE:
      case NodeImpl.CDATA_SECTION_NODE: // CDATASection is a subclass of Text
      case NodeImpl.PROCESSING_INSTRUCTION_NODE:
      case NodeImpl.COMMENT_NODE: {
        const nodeAsCharacterData = this as unknown as CharacterDataImpl;
        nodeAsCharacterData.replaceData(0, nodeAsCharacterData.length, value);
        break;
      }
    }
  }

  // https://dom.spec.whatwg.org/#dom-node-textcontent
  get textContent() {
    switch (this.nodeType) {
      case NodeImpl.DOCUMENT_FRAGMENT_NODE:
      case NodeImpl.ELEMENT_NODE: {
        let text = '';
        for (const child of domSymbolTree.treeIterator(this)) {
          if (child.nodeType === NodeImpl.TEXT_NODE || child.nodeType === NodeImpl.CDATA_SECTION_NODE) {
            text += child.nodeValue;
          }
        }
        return text;
      }

      case NodeImpl.ATTRIBUTE_NODE: {
        return (this as unknown as AttrImpl).value;
      }

      case NodeImpl.TEXT_NODE:
      case NodeImpl.CDATA_SECTION_NODE: // CDATASection is a subclass of Text
      case NodeImpl.PROCESSING_INSTRUCTION_NODE:
      case NodeImpl.COMMENT_NODE: {
        return (this as unknown as CharacterDataImpl)._data;
      }

      default: {
        return null;
      }
    }
  }

  set textContent(value: string) {
    if (value === null) {
      value = '';
    }

    switch (this.nodeType) {
      case NodeImpl.DOCUMENT_FRAGMENT_NODE:
      case NodeImpl.ELEMENT_NODE: {
        // https://dom.spec.whatwg.org/#string-replace-all
        let nodeImpl = null;
        if (value !== '') {
          nodeImpl = this.ownerDocument.createTextNode(value);
        }
        this._replaceAll(nodeImpl);
        break;
      }

      case NodeImpl.ATTRIBUTE_NODE: {
        setAnExistingAttributeValue(this as unknown as AttrImpl, value);
        break;
      }

      case NodeImpl.TEXT_NODE:
      case NodeImpl.CDATA_SECTION_NODE: // CDATASection is a subclass of Text
      case NodeImpl.PROCESSING_INSTRUCTION_NODE:
      case NodeImpl.COMMENT_NODE: {
        const nodeAsCharacterData = this as unknown as CharacterData;
        nodeAsCharacterData.replaceData(0, nodeAsCharacterData.length, value);
        break;
      }
    }
  }

  protected get _cdpImpl() {
    return this._ownerDocument._defaultView._cdpImplementation;
  }

  _modified() {
    this._version++;
    for (const ancestor of domSymbolTree.ancestorsIterator(this)) {
      ancestor._version++;
    }
    if (this.#children) {
      this.#children._update();
    }
    this._clearMemoizedQueries();
    invalidateStyleCache(this);
  }

  _childTextContentChangeSteps() {
    invalidateStyleCache(this);
  }

  _clearMemoizedQueries() {
    this._memoizedQueries = {};
    const myParent = domSymbolTree.parent(this);
    if (myParent) {
      myParent._clearMemoizedQueries();
    }
  }

  _descendantRemoved(parent: Node, child: Node) {
    const myParent = domSymbolTree.parent(this);
    if (myParent) {
      myParent._descendantRemoved(parent, child);
    }
  }

  _descendantAdded(parent: Node, child: Node) {
    const myParent = domSymbolTree.parent(this);
    if (myParent) {
      myParent._descendantAdded(parent, child);
    }
  }

  _attach() {
    this._attached = true;
    for (const child of domSymbolTree.childrenIterator(this)) {
      if (child._attach) {
        child._attach();
      }
    }
  }

  _detach() {
    this._attached = false;
    if (this._ownerDocument && (this._ownerDocument._lastFocusedElement as unknown) === this) {
      this._ownerDocument._lastFocusedElement = null;
    }
    for (const child of domSymbolTree.childrenIterator(this)) {
      if (child._detach) {
        child._detach();
      }
    }
  }

  appendChild<T extends Node>(node: T): T {
    return this._append(node as unknown as NodeImpl) as unknown as T;
  }

  cloneNode(deep?: boolean): Node {
    if (isShadowRoot(this)) {
      throw new DOMException(
        'ShadowRoot nodes are not clonable.',
        'NotSupportedError'
      );
    }
    deep = Boolean(deep);
    return clone(this, undefined, deep);
  }
  compareDocumentPosition(other: Node): number {
    throw new Error('The method "Node.prototype.compareDocumentPosition()" not implemented.');
  }
  contains(other: Node): boolean {
    return isInclusiveAncestor(this, other);
  }
  getRootNode(options?: GetRootNodeOptions): Node {
    return options?.composed ? shadowIncludingRoot(this) : nodeRoot(this);
  }
  hasChildNodes(): boolean {
    return domSymbolTree.hasChildren(this);
  }
  insertBefore<T extends Node>(node: T, child: Node): T {
    return this._preInsert(node as unknown as NodeImpl, child as unknown as NodeImpl) as unknown as T;
  }
  isDefaultNamespace(_namespace: string): boolean {
    throw new Error('The method "Node.prototype.isDefaultNamespace()" not implemented.');
  }
  isEqualNode(otherNode: Node): boolean {
    if (otherNode === null) {
      return false;
    }
    // Fast-path, not in the spec
    if (this === otherNode) {
      return true;
    }
    return nodeEquals(this, otherNode);
  }
  isSameNode(otherNode: Node): boolean {
    if (this === otherNode) {
      return true;
    }
    return false;
  }
  lookupNamespaceURI(prefix: string): string {
    throw new Error('The method "Node.prototype.lookupNamespaceURI()" not implemented.');
  }
  lookupPrefix(namespace: string): string {
    throw new Error('The method "Node.prototype.lookupPrefix()" not implemented.');
  }
  normalize(): void {
    throw new Error('The method "Node.prototype.normalize()" not implemented.');
  }
  removeChild<T extends Node>(child: T): T {
    return this._preRemove(child as unknown as NodeImpl) as unknown as T;
  }

  replaceChild<T extends Node>(node: Node, child: T): T {
    return this._replace(node as unknown as NodeImpl, child as unknown as NodeImpl) as unknown as T;
  }

  // https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
  _preInsertValidity(nodeImpl, childImpl) {
    const { nodeType, nodeName } = nodeImpl;
    const { nodeType: parentType, nodeName: parentName } = this;

    if (
      parentType !== this.DOCUMENT_NODE &&
      parentType !== this.DOCUMENT_FRAGMENT_NODE &&
      parentType !== this.ELEMENT_NODE
    ) {
      throw new DOMException(
        `Node can't be inserted in a ${parentName} parent.`,
        'HierarchyRequestError'
      );
    }

    if (isHostInclusiveAncestor(nodeImpl, this)) {
      throw new DOMException(
        'The operation would yield an incorrect node tree.',
        'HierarchyRequestError'
      );
    }

    if (childImpl && domSymbolTree.parent(childImpl) !== this) {
      throw new DOMException(
        "The child can not be found in the parent.",
        'NotFoundError'
      );
    }

    if (
      nodeType !== this.DOCUMENT_FRAGMENT_NODE &&
      nodeType !== this.DOCUMENT_TYPE_NODE &&
      nodeType !== this.ELEMENT_NODE &&
      nodeType !== this.TEXT_NODE &&
      nodeType !== this.CDATA_SECTION_NODE && // CData section extends from Text
      nodeType !== this.PROCESSING_INSTRUCTION_NODE &&
      nodeType !== this.COMMENT_NODE
    ) {
      throw new DOMException(
        `${nodeName} node can't be inserted in parent node.`,
        'HierarchyRequestError'
      );
    }

    if (
      (nodeType === this.TEXT_NODE && parentType === this.DOCUMENT_NODE) ||
      (nodeType === this.DOCUMENT_TYPE_NODE && parentType !== this.DOCUMENT_NODE)
    ) {
      throw new DOMException(
        `${nodeName} node can't be inserted in ${parentName} parent.`,
        'HierarchyRequestError'
      );
    }

    if (parentType === this.DOCUMENT_NODE) {
      const nodeChildren = domSymbolTree.childrenToArray(nodeImpl);
      const parentChildren = domSymbolTree.childrenToArray(this);

      switch (nodeType) {
        case this.DOCUMENT_FRAGMENT_NODE: {
          const nodeChildrenElements = nodeChildren.filter(child => child.nodeType === this.ELEMENT_NODE);
          if (nodeChildrenElements.length > 1) {
            throw new DOMException(
              `Invalid insertion of ${nodeName} node in ${parentName} node.`,
              'HierarchyRequestError'
            );
          }

          const hasNodeTextChildren = nodeChildren.some(child => child.nodeType === this.TEXT_NODE);
          if (hasNodeTextChildren) {
            throw new DOMException(
              `Invalid insertion of ${nodeName} node in ${parentName} node.`,
              'HierarchyRequestError'
            );
          }

          if (
            nodeChildrenElements.length === 1 &&
            (
              parentChildren.some(child => child.nodeType === this.ELEMENT_NODE) ||
              (childImpl && childImpl.nodeType === this.DOCUMENT_TYPE_NODE) ||
              (
                childImpl &&
                domSymbolTree.nextSibling(childImpl) &&
                domSymbolTree.nextSibling(childImpl).nodeType === this.DOCUMENT_TYPE_NODE
              )
            )
          ) {
            throw new DOMException(
              `Invalid insertion of ${nodeName} node in ${parentName} node.`,
              'HierarchyRequestError'
            );
          }
          break;
        }

        case this.ELEMENT_NODE:
          if (
            parentChildren.some(child => child.nodeType === NodeImpl.ELEMENT_NODE) ||
            (childImpl && childImpl.nodeType === NodeImpl.DOCUMENT_TYPE_NODE) ||
            (
              childImpl &&
              domSymbolTree.nextSibling(childImpl) &&
              domSymbolTree.nextSibling(childImpl).nodeType === NodeImpl.DOCUMENT_TYPE_NODE
            )
          ) {
            throw new DOMException(
              `Invalid insertion of ${nodeName} node in ${parentName} node.`,
              'HierarchyRequestError'
            );
          }
          break;

        case this.DOCUMENT_TYPE_NODE:
          if (
            parentChildren.some(child => child.nodeType === this.DOCUMENT_TYPE_NODE) ||
            (
              childImpl &&
              domSymbolTree.previousSibling(childImpl) &&
              domSymbolTree.previousSibling(childImpl).nodeType === this.ELEMENT_NODE
            ) ||
            (!childImpl && parentChildren.some(child => child.nodeType === this.ELEMENT_NODE))
          ) {
            throw new DOMException(
              `Invalid insertion of ${nodeName} node in ${parentName} node.`,
              'HierarchyRequestError'
            );
          }
          break;
      }
    }
  }

  // https://dom.spec.whatwg.org/#concept-node-pre-insert
  _preInsert(nodeImpl: NodeImpl, childImpl: NodeImpl) {
    this._preInsertValidity(nodeImpl, childImpl);

    let referenceChildImpl = childImpl;
    if (referenceChildImpl === nodeImpl) {
      referenceChildImpl = domSymbolTree.nextSibling(nodeImpl);
    }

    this._ownerDocument._adoptNode(nodeImpl);
    this._insert(nodeImpl, referenceChildImpl);
    return nodeImpl;
  }

  // https://dom.spec.whatwg.org/#concept-node-insert
  _insert(nodeImpl: NodeImpl, childImpl: NodeImpl, suppressObservers?) {
    const count = nodeImpl.nodeType === NodeImpl.DOCUMENT_FRAGMENT_NODE ?
      domSymbolTree.childrenCount(nodeImpl) :
      1;

    if (childImpl) {
      const childIndex = domSymbolTree.index(childImpl);
      for (const range of this._referencedRanges as Set<RangeImpl>) {
        const { _start, _end } = range;
        if (_start.offset > childIndex) {
          range._setLiveRangeStart(this, _start.offset + count);
        }
        if (_end.offset > childIndex) {
          range._setLiveRangeEnd(this, _end.offset + count);
        }
      }
    }

    const nodesImpl = nodeImpl.nodeType === NodeImpl.DOCUMENT_FRAGMENT_NODE ?
      domSymbolTree.childrenToArray(nodeImpl) :
      [nodeImpl];

    if (nodeImpl.nodeType === NodeImpl.DOCUMENT_FRAGMENT_NODE) {
      let grandChildImpl;
      while ((grandChildImpl = domSymbolTree.firstChild(nodeImpl))) {
        nodeImpl._remove(grandChildImpl, true);
      }
    }

    if (nodeImpl.nodeType === NodeImpl.DOCUMENT_FRAGMENT_NODE) {
      queueTreeMutationRecord(nodeImpl, [], nodesImpl, null, null);
    }

    const previousChildImpl = childImpl ?
      domSymbolTree.previousSibling(childImpl) :
      domSymbolTree.lastChild(this);

    let isConnected;
    for (const node of nodesImpl) {
      if (!childImpl) {
        domSymbolTree.appendChild(this, node);
      } else {
        domSymbolTree.insertBefore(childImpl, node);
      }

      if (
        (this.nodeType === NodeImpl.ELEMENT_NODE && this._shadowRoot !== null) &&
        (node.nodeType === NodeImpl.ELEMENT_NODE || node.nodeType === NodeImpl.TEXT_NODE)
      ) {
        assignSlot(node);
      }

      this._modified();

      if (node.nodeType === NodeImpl.TEXT_NODE ||
        node.nodeType === NodeImpl.CDATA_SECTION_NODE) {
        this._childTextContentChangeSteps();
      }

      if (isSlot(this) && this._assignedNodes.length === 0 && isShadowRoot(nodeRoot(this) as NodeImpl)) {
        signalSlotChange(this);
      }

      const root = nodeRoot(node) as NodeImpl;
      if (isShadowRoot(root)) {
        assignSlotableForTree(root);
      }

      if (this._attached && nodeImpl._attach) {
        node._attach();
      }

      this._descendantAdded(this, node);

      if (isConnected === undefined) {
        isConnected = node.isConnected;
      }

      // TODO: CustomElement
      // if (isConnected) {
      //   for (const inclusiveDescendant of shadowIncludingInclusiveDescendantsIterator(node)) {
      //     if (inclusiveDescendant._ceState === 'custom') {
      //       enqueueCECallbackReaction(inclusiveDescendant, 'connectedCallback', []);
      //     } else {
      //       tryUpgradeElement(inclusiveDescendant);
      //     }
      //   }
      // }
    }

    if (!suppressObservers) {
      queueTreeMutationRecord(this, nodesImpl, [], previousChildImpl, childImpl);
    }
  }

  // https://dom.spec.whatwg.org/#concept-node-append
  _append(nodeImpl: NodeImpl) {
    return this._preInsert(nodeImpl, null);
  }

  // https://dom.spec.whatwg.org/#concept-node-replace
  _replace(nodeImpl: NodeImpl, childImpl: NodeImpl) {
    const { nodeType, nodeName } = nodeImpl;
    const { nodeType: parentType, nodeName: parentName } = this;

    // Note: This section differs from the pre-insert validation algorithm.
    if (
      parentType !== this.DOCUMENT_NODE &&
      parentType !== this.DOCUMENT_FRAGMENT_NODE &&
      parentType !== this.ELEMENT_NODE
    ) {
      throw new DOMException(
        `Node can't be inserted in a ${parentName} parent.`,
        'HierarchyRequestError'
      );
    }

    if (isHostInclusiveAncestor(nodeImpl, this)) {
      throw new DOMException(
        'The operation would yield an incorrect node tree.',
        'HierarchyRequestError'
      );
    }

    if (childImpl && domSymbolTree.parent(childImpl) !== this) {
      throw new DOMException(
        'The child can not be found in the parent.',
        'NotFoundError'
      );
    }

    if (
      nodeType !== this.DOCUMENT_FRAGMENT_NODE &&
      nodeType !== this.DOCUMENT_TYPE_NODE &&
      nodeType !== this.ELEMENT_NODE &&
      nodeType !== this.TEXT_NODE &&
      nodeType !== this.CDATA_SECTION_NODE && // CData section extends from Text
      nodeType !== this.PROCESSING_INSTRUCTION_NODE &&
      nodeType !== this.COMMENT_NODE
    ) {
      throw new DOMException(
        `${nodeName} node can't be inserted in parent node.`,
        'HierarchyRequestError'
      );
    }

    if (
      (nodeType === this.TEXT_NODE && parentType === this.DOCUMENT_NODE) ||
      (nodeType === this.DOCUMENT_TYPE_NODE && parentType !== this.DOCUMENT_NODE)
    ) {
      throw new DOMException(
        `${nodeName} node can't be inserted in ${parentName} parent.`,
        'HierarchyRequestError'
      );
    }

    if (parentType === this.DOCUMENT_NODE) {
      const nodeChildren = domSymbolTree.childrenToArray(nodeImpl);
      const parentChildren = domSymbolTree.childrenToArray(this);

      switch (nodeType) {
        case this.DOCUMENT_FRAGMENT_NODE: {
          const nodeChildrenElements = nodeChildren.filter(child => child.nodeType === this.ELEMENT_NODE);
          if (nodeChildrenElements.length > 1) {
            throw new DOMException(
              `Invalid insertion of ${nodeName} node in ${parentName} node.`,
              'HierarchyRequestError'
            );
          }

          const hasNodeTextChildren = nodeChildren.some(child => child.nodeType === this.TEXT_NODE);
          if (hasNodeTextChildren) {
            throw new DOMException(
              `Invalid insertion of ${nodeName} node in ${parentName} node.`,
              'HierarchyRequestError'
            );
          }


          const parentChildElements = parentChildren.filter(child => child.nodeType === this.ELEMENT_NODE);
          if (
            nodeChildrenElements.length === 1 &&
            (
              (parentChildElements.length === 1 && parentChildElements[0] !== childImpl) ||
              (
                childImpl &&
                domSymbolTree.nextSibling(childImpl) &&
                domSymbolTree.nextSibling(childImpl).nodeType === this.DOCUMENT_TYPE_NODE
              )
            )
          ) {
            throw new DOMException(
              `Invalid insertion of ${nodeName} node in ${parentName} node.`,
              'HierarchyRequestError'
            );
          }
          break;
        }

        case this.ELEMENT_NODE:
          if (
            parentChildren.some(child => child.nodeType === this.ELEMENT_NODE && child !== childImpl) ||
            (
              childImpl &&
              domSymbolTree.nextSibling(childImpl) &&
              domSymbolTree.nextSibling(childImpl).nodeType === this.DOCUMENT_TYPE_NODE
            )
          ) {
            throw new DOMException(
              `Invalid insertion of ${nodeName} node in ${parentName} node.`,
              'HierarchyRequestError'
            );
          }
          break;

        case this.DOCUMENT_TYPE_NODE:
          if (
            parentChildren.some(child => child.nodeType === this.DOCUMENT_TYPE_NODE && child !== childImpl) ||
            (
              childImpl &&
              domSymbolTree.previousSibling(childImpl) &&
              domSymbolTree.previousSibling(childImpl).nodeType === this.ELEMENT_NODE
            )
          ) {
            throw new DOMException(
              `Invalid insertion of ${nodeName} node in ${parentName} node.`,
              'HierarchyRequestError'
            );
          }
          break;
      }
    }

    let referenceChildImpl = domSymbolTree.nextSibling(childImpl);
    if (referenceChildImpl === nodeImpl) {
      referenceChildImpl = domSymbolTree.nextSibling(nodeImpl);
    }

    const previousSiblingImpl = domSymbolTree.previousSibling(childImpl);
    this._ownerDocument._adoptNode(nodeImpl);

    let removedNodesImpl = [];
    if (domSymbolTree.parent(childImpl)) {
      removedNodesImpl = [childImpl];
      this._remove(childImpl, true);
    }

    const nodesImpl = nodeImpl.nodeType === this.DOCUMENT_FRAGMENT_NODE ?
      domSymbolTree.childrenToArray(nodeImpl) :
      [nodeImpl];
    this._insert(nodeImpl, referenceChildImpl, true);

    // TODO
    // queueTreeMutationRecord(this, nodesImpl, removedNodesImpl, previousSiblingImpl, referenceChildImpl);
    return childImpl;
  }

  // https://dom.spec.whatwg.org/#concept-node-replace-all
  _replaceAll(nodeImpl: NodeImpl) {
    if (nodeImpl !== null) {
      this._ownerDocument._adoptNode(nodeImpl);
    }

    const removedNodesImpl = domSymbolTree.childrenToArray(this);

    let addedNodesImpl;
    if (nodeImpl === null) {
      addedNodesImpl = [];
    } else if (nodeImpl.nodeType === NodeImpl.DOCUMENT_FRAGMENT_NODE) {
      addedNodesImpl = domSymbolTree.childrenToArray(nodeImpl);
    } else {
      addedNodesImpl = [nodeImpl];
    }

    for (const childImpl of domSymbolTree.childrenIterator(this)) {
      this._remove(childImpl, true);
    }

    if (nodeImpl !== null) {
      this._insert(nodeImpl, null, true);
    }

    if (addedNodesImpl.length > 0 || removedNodesImpl.length > 0) {
      queueTreeMutationRecord(this, addedNodesImpl, removedNodesImpl, null, null);
    }
  }

  // https://dom.spec.whatwg.org/#concept-node-pre-remove
  _preRemove(childImpl: NodeImpl) {
    if (domSymbolTree.parent(childImpl) !== this) {
      throw new DOMException(
        'The node to be removed is not a child of this node.',
        'NotFoundError'
      );
    }
    this._remove(childImpl);
    return childImpl;
  }

  // https://dom.spec.whatwg.org/#concept-node-remove
  _remove(nodeImpl: NodeImpl, suppressObservers?) {
    const index = domSymbolTree.index(nodeImpl);

    for (const descendant of domSymbolTree.treeIterator(nodeImpl)) {
      for (const range of descendant._referencedRanges) {
        const { _start, _end } = range;

        if (_start.node === descendant) {
          range._setLiveRangeStart(this, index);
        }

        if (_end.node === descendant) {
          range._setLiveRangeEnd(this, index);
        }
      }
    }

    for (const range of this._referencedRanges as Set<RangeImpl>) {
      const { _start, _end } = range;

      if (_start.node as unknown as NodeImpl === this && _start.offset > index) {
        range._setLiveRangeStart(this, _start.offset - 1);
      }

      if (_end.node as unknown as NodeImpl === this && _end.offset > index) {
        range._setLiveRangeEnd(this, _end.offset - 1);
      }
    }

    if (this._ownerDocument) {
      this._ownerDocument._runPreRemovingSteps(nodeImpl);
    }

    const oldPreviousSiblingImpl = domSymbolTree.previousSibling(nodeImpl);
    const oldNextSiblingImpl = domSymbolTree.nextSibling(nodeImpl);
    domSymbolTree.remove(nodeImpl);

    if (nodeImpl.#assignedSlot) {
      assignSlotable(nodeImpl.#assignedSlot);
    }
    if (isSlot(this) && this._assignedNodes.length === 0 && isShadowRoot(nodeRoot(this) as NodeImpl)) {
      signalSlotChange(this);
    }

    let hasSlotDescendant = isSlot(nodeImpl);
    if (!hasSlotDescendant) {
      for (const child of domSymbolTree.treeIterator(nodeImpl)) {
        if (isSlot(child)) {
          hasSlotDescendant = true;
          break;
        }
      }
    }

    if (hasSlotDescendant) {
      assignSlotableForTree(nodeRoot(this));
      assignSlotableForTree(nodeImpl);
    }

    this._modified();
    nodeImpl._detach();
    this._descendantRemoved(this, nodeImpl);

    // TODO: CustomElement
    // if (this.isConnected) {
    //   if (nodeImpl._ceState === 'custom') {
    //     enqueueCECallbackReaction(nodeImpl, 'disconnectedCallback', []);
    //   }
    //   for (const descendantImpl of shadowIncludingDescendantsIterator(nodeImpl)) {
    //     if (descendantImpl._ceState === 'custom') {
    //       enqueueCECallbackReaction(descendantImpl, 'disconnectedCallback', []);
    //     }
    //   }
    // }

    if (!suppressObservers) {
      queueTreeMutationRecord(this, [], [nodeImpl], oldPreviousSiblingImpl, oldNextSiblingImpl);
    }

    if (nodeImpl.nodeType === NodeImpl.TEXT_NODE) {
      this._childTextContentChangeSteps();
    }
  }

  // Parent-Node
  get children(): HTMLCollection {
    return domSymbolTree.childrenToArray(this, {
      filter: node => node.nodeType === NodeImpl.prototype.ELEMENT_NODE,
    }) as any;
  }

  get firstElementChild(): Element {
    for (const child of domSymbolTree.childrenIterator(this)) {
      if (child.nodeType === NodeImpl.prototype.ELEMENT_NODE) {
        return child;
      }
    }
    return null;
  }

  get lastElementChild(): Element {
    for (const child of domSymbolTree.childrenIterator(this, { reverse: true })) {
      if (child.nodeType === NodeImpl.prototype.ELEMENT_NODE) {
        return child;
      }
    }
    return null;
  }

  get childElementCount(): number {
    return this.children.length;
  }
}
