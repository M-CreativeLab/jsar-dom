import { SpatialDocumentImpl } from 'src/living/nodes/SpatialDocument';
import { ClientConnection, Connection, ServerConnection } from './connection';
import { CdpBrowser } from './definitions';
import type { ITransport } from './transport';
import { ISerializer } from './serializer';
import { JsonSerializer } from './serializer/json';
import { ClientCdpSession } from './client';

namespace CdpJSAR {
  export interface Domains {
    DOM: CdpBrowser.Domains['DOM'];
  }
}

export function createRemoteClient<TDomains = CdpJSAR.Domains>(
  transport: ITransport,
  serializer: ISerializer = new JsonSerializer(),
): ClientConnection<TDomains> {
  return new Connection<ClientCdpSession<TDomains>>(transport, serializer, ClientCdpSession);
}

export class CdpServerImplementation {
  private _server: ServerConnection<CdpJSAR.Domains>

  constructor(private _document: SpatialDocumentImpl, private _transport: ITransport) {
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
        async getDocument(client, arg) {
          return null;
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
        async querySelector(client, arg) {
          return null;
        },
        async querySelectorAll(client, arg) {
          return null;
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
}
