import { NativeDocument } from '../../impl-interfaces';
import { domSymbolTree } from '../helpers/internal-constants';
import { NodeImpl } from '../nodes/Node';
import { filter, FILTER_ACCEPT } from './helpers';

export default class NodeIteratorImpl implements NodeIterator {
  _hostObject: NativeDocument;
  _active: boolean = false;
  _pointerBeforeReferenceNode: boolean = true;
  _referenceNode: NodeImpl;

  filter: NodeFilter;
  get referenceNode(): Node {
    return this._referenceNode;
  }
  get pointerBeforeReferenceNode(): boolean {
    return this._pointerBeforeReferenceNode;
  }
  root: Node;
  whatToShow: number;

  constructor(
    nativeDocument: NativeDocument,
    args,
    privateData: {
      root: NodeImpl;
      referenceNode?: Node;
      pointerBeforeReferenceNode?: boolean;
      whatToShow?: number;
      filter: NodeFilter;
    }
  ) {
    this._hostObject = nativeDocument;
    this.root = privateData.root;
    this.whatToShow = privateData.whatToShow;
    this.filter = privateData.filter;
    this._referenceNode = privateData.root;
  }

  detach(): void {
    throw new Error("Method not implemented.");
  }

  nextNode(): Node {
    throw new Error("Method not implemented.");
  }

  previousNode(): Node {
    throw new Error("Method not implemented.");
  }

  // Called by Documents.
  _preRemovingSteps(toBeRemovedNode: Node) {
    // Second clause is https://github.com/whatwg/dom/issues/496
    if (!toBeRemovedNode.contains(this._referenceNode) || toBeRemovedNode === this.root) {
      return;
    }

    if (this._pointerBeforeReferenceNode) {
      let next = null;
      let candidateForNext = domSymbolTree.following(toBeRemovedNode, { skipChildren: true });
      while (candidateForNext !== null) {
        if (this.root.contains(candidateForNext)) {
          next = candidateForNext;
          break;
        }
        candidateForNext = domSymbolTree.following(candidateForNext, { skipChildren: true });
      }
      if (next !== null) {
        this._referenceNode = next;
        return;
      }
      this._pointerBeforeReferenceNode = false;
    }

    const { previousSibling } = toBeRemovedNode;
    this._referenceNode = previousSibling === null ?
      toBeRemovedNode.parentNode :
      domSymbolTree.lastInclusiveDescendant(toBeRemovedNode.previousSibling);
  }

  _traverse(direction: 'next' | 'previous') {
    let node = this._referenceNode;
    let beforeNode = this._pointerBeforeReferenceNode;

    while (true) {
      if (direction === 'next') {
        if (!beforeNode) {
          node = domSymbolTree.following(node, { root: this.root });
          if (!node) {
            return null;
          }
        }
        beforeNode = false;
      } else if (direction === 'previous') {
        if (beforeNode) {
          node = domSymbolTree.preceding(node, { root: this.root });
          if (!node) {
            return null;
          }
        }
        beforeNode = true;
      }

      const result = filter(this, node);
      if (result === FILTER_ACCEPT) {
        break;
      }
    }
    this._referenceNode = node;
    this._pointerBeforeReferenceNode = beforeNode;
    return node;
  }
}
