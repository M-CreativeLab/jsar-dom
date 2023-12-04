import { convertNodesIntoNode } from '../node';
import { NodeImpl } from './Node';
import ParentNodeImpl from './ParentNode';

/**
 * Represents an implementation of the ChildNode interface.
 */
export default interface ChildNodeImpl extends NodeImpl {};
export default class ChildNodeImpl implements ChildNode {
  /**
   * Inserts nodes or strings after the current node.
   * 
   * @param nodes - The nodes or strings to insert.
   */
  after(...nodes: (string | Node)[]): void {
    const parent = this.parentNode as ParentNodeImpl;
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

      parent._preInsert(convertNodesIntoNode(this._ownerDocument, nodes), viableNextSibling as ChildNodeImpl);
    }
  }

  /**
   * Inserts the specified nodes or strings before the current node.
   * 
   * @param nodes - The nodes or strings to insert.
   * @returns void
   */
  before(...nodes: (string | Node)[]): void {
    const parent = this.parentNode as ParentNodeImpl;
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
        (viablePreviousSibling ? viablePreviousSibling.nextSibling : parent.firstChild) as ChildNodeImpl
      );
    }
  }

  /**
   * Removes the node from its parent node.
   */
  remove(): void {
    if (!this.parentNode) {
      return;
    }
    (this.parentNode as ParentNodeImpl)._remove(this);
  }

  /**
   * Replaces the child nodes of the current node with the specified nodes.
   * 
   * @param nodes - The nodes to replace the child nodes with.
   */
  replaceWith(...nodes: (string | Node)[]): void {
    const parent = this.parentNode as ParentNodeImpl;
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

      const node = convertNodesIntoNode<NodeImpl>(this._ownerDocument, nodes);
      if (this.parentNode as ParentNodeImpl === parent) {
        parent._replace(node, this);
      } else {
        parent._preInsert(node, viableNextSibling as ChildNodeImpl);
      }
    }
  }
}
