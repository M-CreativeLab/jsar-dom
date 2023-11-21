import { convertNodesIntoNode } from '../node';
import { NodeImpl } from './Node';

export default class ChildNodeImpl extends NodeImpl implements ChildNode {

  after(...nodes: (string | Node)[]): void {
    const parent = this.parentNode;
    if (parent) {
      let viableNextSibling = this.nextSibling;
      let idx = viableNextSibling ? nodes.indexOf(viableNextSibling) : -1;

      while (idx !== -1) {
        viableNextSibling = viableNextSibling.nextSibling;
        if (!viableNextSibling) {
          break;
        }
        idx = nodes.indexOf(viableNextSibling);
      }

      parent._preInsert(convertNodesIntoNode(this._ownerDocument, nodes), viableNextSibling);
    }
  }

  before(...nodes: (string | Node)[]): void {
    const parent = this.parentNode;
    if (parent) {
      let viablePreviousSibling = this.previousSibling;
      let idx = viablePreviousSibling ? nodes.indexOf(viablePreviousSibling) : -1;

      while (idx !== -1) {
        viablePreviousSibling = viablePreviousSibling.previousSibling;
        if (!viablePreviousSibling) {
          break;
        }
        idx = nodes.indexOf(viablePreviousSibling);
      }

      parent._preInsert(
        convertNodesIntoNode(this._ownerDocument, nodes),
        viablePreviousSibling ? viablePreviousSibling.nextSibling : parent.firstChild
      );
    }
  }

  remove(): void {
    if (!this.parentNode) {
      return;
    }
    this.parentNode._remove(this);
  }

  replaceWith(...nodes: (string | Node)[]): void {
    const parent = this.parentNode;
    if (parent) {
      let viableNextSibling = this.nextSibling;
      let idx = viableNextSibling ? nodes.indexOf(viableNextSibling) : -1;

      while (idx !== -1) {
        viableNextSibling = viableNextSibling.nextSibling;
        if (!viableNextSibling) {
          break;
        }
        idx = nodes.indexOf(viableNextSibling);
      }

      const node = convertNodesIntoNode(this._ownerDocument, nodes);
      if (this.parentNode === parent) {
        parent._replace(node, this);
      } else {
        parent._preInsert(node, viableNextSibling);
      }
    }
  }
}
