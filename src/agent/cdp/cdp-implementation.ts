import { SpatialDocumentImpl } from 'src/living/nodes/SpatialDocument';
import { ClientConnection, Connection, ServerConnection } from './connection';
import { CdpBrowser } from './definitions';
import type { ITransport } from './transport';
import { ISerializer } from './serializer';
import { JsonSerializer } from './serializer/json';
import { ClientCdpSession } from './client';
import type { NodeImpl } from '../../living/nodes/Node';
import { isAttributeNode, isElementNode } from '../../living/node-type';

namespace CdpJSAR {
  export interface Domains {
    DOM: CdpBrowser.Domains['DOM'];
  }
}

export function createRemoteClient(
  transport: ITransport,
  serializer: ISerializer = new JsonSerializer(),
): ClientConnection<CdpJSAR.Domains> {
  return new Connection<ClientCdpSession<CdpJSAR.Domains>>(transport, serializer, ClientCdpSession);
}

export class CdpServerImplementation {
  private _server: ServerConnection<CdpJSAR.Domains>;
  private _document: SpatialDocumentImpl;
  private _domNodes: Map<number, NodeImpl> = new Map();

  constructor(private _transport: ITransport) {
    this._server = Connection.server<CdpJSAR.Domains>(this._transport);
    this._server.rootSession.api = {
      DOM: {
        async collectClassNamesFromSubtree(client, arg) {
          return null;
        },
        async copyTo(client, arg) {
          return null;
        },
        async describeNode(client, arg) {
          console.log('describe node');
          return null;
        },
        async scrollIntoViewIfNeeded(client, arg) {
          return null;
        },
        async disable(client, arg) {
          return null;
        },
        async discardSearchResults(client, arg) {
          return null;
        },
        async enable(client, arg) {
          return null;
        },
        async focus(client, arg) {
          return null;
        },
        async getAttributes(client, arg) {
          return null;
        },
        async getBoxModel(client, arg) {
          return null;
        },
        async getContentQuads(client, arg) {
          return null;
        },
        getDocument: async (_client, arg) => {
          return Promise.resolve({
            root: this.serializeNode(this._document, arg.depth),
          });
        },
        async getFlattenedDocument(client, arg) {
          return null;
        },
        async getNodesForSubtreeByStyle(client, arg) {
          return null;
        },
        async getNodeForLocation(client, arg) {
          return null;
        },
        async getOuterHTML(client, arg) {
          return null;
        },
        async getRelayoutBoundary(client, arg) {
          return null;
        },
        async getSearchResults(client, arg) {
          return null;
        },
        async hideHighlight(client, arg) {
          return null;
        },
        async highlightNode(client, arg) {
          return null;
        },
        async highlightRect(client, arg) {
          return null;
        },
        async markUndoableState(client, arg) {
          return null;
        },
        async moveTo(client, arg) {
          return null;
        },
        async performSearch(client, arg) {
          return null;
        },
        async pushNodeByPathToFrontend(client, arg) {
          return null;
        },
        async pushNodesByBackendIdsToFrontend(client, arg) {
          return null;
        },
        querySelector: async (_client, arg) => {
          const targetNode = this._domNodes.get(arg.nodeId);
          if (!targetNode || !isElementNode(targetNode)) {
            return null;
          } else {
            const resultElement = targetNode.querySelector(arg.selector);
            return {
              nodeId: (resultElement as unknown as NodeImpl)._inspectorId,
            };
          }
        },
        querySelectorAll: async (_client, arg) => {
          const targetNode = this._domNodes.get(arg.nodeId);
          if (!targetNode || !isElementNode(targetNode)) {
            return { nodeIds: [] };
          } else {
            const resultElements = targetNode.querySelectorAll(arg.selector);
            const nodeIds: number[] = [];
            resultElements.forEach((elem) => {
              nodeIds.push((elem as unknown as NodeImpl)._inspectorId);
            });
            return {
              nodeIds,
            };
          }
        },
        async getTopLayerElements(client, arg) {
          return null;
        },
        async redo(client, arg) {
          return null;
        },
        async removeAttribute(client, arg) {
          return null;
        },
        async removeNode(client, arg) {
          return null;
        },
        async requestChildNodes(client, arg) {
          return null;
        },
        async requestNode(client, arg) {
          return null;
        },
        async resolveNode(client, arg) {
          return null;
        },
        async setAttributeValue(client, arg) {
          return null;
        },
        async setAttributesAsText(client, arg) {
          return null;
        },
        async setFileInputFiles(client, arg) {
          return null;
        },
        async setNodeStackTracesEnabled(client, arg) {
          return null;
        },
        async getNodeStackTraces(client, arg) {
          return null;
        },
        async getFileInfo(client, arg) {
          return null;
        },
        async setInspectedNode(client, arg) {
          return null;
        },
        async setNodeName(client, arg) {
          return null;
        },
        async setNodeValue(client, arg) {
          return null;
        },
        async setOuterHTML(client, arg) {
          return null;
        },
        async undo(client, arg) {
          return null;
        },
        async getFrameOwner(client, arg) {
          return null;
        },
        async getContainerForNode(client, arg) {
          return null;
        },
        async getQueryingDescendantsForContainer(client, arg) {
          return null;
        },
      }
    };
  }

  get rootSession() {
    return this._server.rootSession;
  }

  set document(_document: SpatialDocumentImpl) {
    this._document = _document;
  }

  addNode(node: NodeImpl) {
    this._domNodes.set(node._inspectorId, node);
  }

  removeNode(node: NodeImpl) {
    this._domNodes.delete(node._inspectorId);
  }

  serializeNode(node: NodeImpl, depth: number = -1): CdpBrowser.DOM.Node {
    const serialized: CdpBrowser.DOM.Node = {
      nodeId: node._inspectorId,
      parentId: node.parentNode ? (node.parentNode as unknown as NodeImpl)._inspectorId : null,
      backendNodeId: node._inspectorId,
      nodeType: node.nodeType,
      nodeName: node.nodeName,
      localName: isElementNode(node) ? node.localName : null,
      nodeValue: node.nodeValue,
      childNodeCount: node.childNodes.length,
      children: [],
      attributes: [],
      documentURL: node._ownerDocument.documentURI,
      baseURL: node.baseURI,
      compatibilityMode: 'NoQuirksMode',
    };
    if (node.childNodes.length > 0 && (depth === -1 || depth > 0)) {
      node.childNodes.forEach(childNode => {
        serialized.children.push(this.serializeNode(childNode as unknown as NodeImpl, depth === -1 ? depth : depth - 1));
      });
    }
    if (isAttributeNode(node)) {
      serialized.name = node.name;
      serialized.value = node.value;
    }
    return serialized;
  }
}
