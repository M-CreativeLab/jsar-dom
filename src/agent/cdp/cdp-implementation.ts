
import type { BaseWindowImpl, WindowOrDOMInit } from '../window';
import type { NativeDocument } from '../../impl-interfaces';
import { ClientConnection, Connection, ServerConnection } from './connection';
import { CdpBrowser } from './definitions';
import type { ITransport } from './transport';
import { ISerializer } from './serializer';
import { JsonSerializer } from './serializer/json';
import { ClientCdpSession } from './client';
import type { SpatialDocumentImpl } from '../../living/nodes/SpatialDocument';
import type { NodeImpl } from '../../living/nodes/Node';
import { isAttributeNode, isElementNode, isSpatialElement } from '../../living/node-type';

namespace CdpJSAR {
  export interface Domains {
    Log: CdpBrowser.Domains['Log'];
    DOM: CdpBrowser.Domains['DOM'];
    SpatialDOM: SpatialDOMApi;
  }

  export interface SpatialDOMApi {
    requests: {
      describeElement: { params: SpatialElement.DescribeElementParams, result: SpatialElement.DescribeElementResult };
      highlightElement: { params: SpatialElement.HighlightElementParams, result: SpatialElement.HighlightElementResult };
      unhighlightElement: { params: SpatialElement.UnhighlightElementParams, result: SpatialElement.UnhighlightElementResult };
      unhighlightElements: { params: SpatialElement.UnhighlightElementsParams, result: SpatialElement.UnhighlightElementsResult };
      setTransform: { params: SpatialElement.SetTransformParams, result: SpatialElement.SetTransformResult };
      displayMeshNormals: { params: SpatialElement.DisplayMeshNormalsParams, result: SpatialElement.DisplayMeshNormalsResult };
      displayVertexNormals: { params: SpatialElement.DisplayVertexNormalsParams, result: SpatialElement.DisplayVertexNormalsResult };
      displayMeshBones: { params: SpatialElement.DisplayMeshBonesParams, result: SpatialElement.DisplayMeshBonesResult };
      renderWireframeOverMesh: { params: SpatialElement.RenderWireframeOverMeshParams, result: SpatialElement.RenderWireframeOverMeshResult };
    };
    events: {};
  }

  export namespace SpatialElement {
    export type Color3 = [number, number, number];
    export type Color4 = [number, number, number, number];
    export type Vector3 = { x: number; y: number; z: number; };
    export type Quaternion = { x: number; y: number; z: number; w: number; };
    export type Texture = {
      width: number;
      height: number;
    };
    export type SpatialType = string;
    export type SpatialTransform = {
      position: Vector3;
      rotation: Quaternion;
      scaling: Vector3;
    };
    export type MeshDescriptor = {
      vertices: number;
      faces: number;
      hasNormals?: boolean;
      hasTangents?: boolean;
      hasColors?: boolean;
      hasUv0?: boolean;
      hasUv1?: boolean;
      hasUv2?: boolean;
      hasUv3?: boolean;
      hasUv4?: boolean;
    };
    export type MaterialDescriptor = {
      type: string;
      name: string;
      diffuseColor?: Color3;
      diffuseTexture?: Texture;
      ambientColor?: Color3;
      ambientTexture?: Texture;
      specularColor?: Color3;
      specularTexture?: Texture;
      emissiveColor?: Color3;
      emissiveTexture?: Texture;
      // PBR
      albedoColor?: Color3;
      albedoTexture?: Texture;
      metallic?: number;
      metallicRoughnessTexture?: Texture;
      roughness?: number;
    };

    export interface Node {
      nodeId: CdpBrowser.DOM.NodeId;
      parentId?: CdpBrowser.DOM.NodeId;
      type: SpatialType;
      transform?: SpatialTransform;
      mesh?: MeshDescriptor;
      material?: MaterialDescriptor;
    }
    export interface DescribeElementParams {
      nodeId: CdpBrowser.DOM.NodeId;
      depth?: CdpBrowser.integer;
    }
    export interface DescribeElementResult {
      node: SpatialElement.Node;
    }
    export interface HighlightElementParams {
      nodeId: CdpBrowser.DOM.NodeId;
    }
    export interface HighlightElementResult { }
    export interface SetTransformParams {
      nodeId: CdpBrowser.DOM.NodeId;
      transform: SpatialTransform;
    }
    export interface UnhighlightElementParams {
      nodeId: CdpBrowser.DOM.NodeId;
    }
    export interface UnhighlightElementResult { }
    export interface UnhighlightElementsParams { }
    export interface UnhighlightElementsResult { }
    export interface SetTransformResult { }
    export interface DisplayMeshNormalsParams {
      nodeId: CdpBrowser.DOM.NodeId;
      display: boolean;
    }
    export interface DisplayMeshNormalsResult { }
    export interface DisplayVertexNormalsParams {
      nodeId: CdpBrowser.DOM.NodeId;
      display: boolean;
    }
    export interface DisplayVertexNormalsResult { }
    export interface DisplayMeshBonesParams {
      nodeId: CdpBrowser.DOM.NodeId;
      display: boolean;
    }
    export interface DisplayMeshBonesResult { }
    export interface RenderWireframeOverMeshParams {
      nodeId: CdpBrowser.DOM.NodeId;
      display: boolean;
    }
    export interface RenderWireframeOverMeshResult { }
  }
}

function toColor3(input: BABYLON.Color3): CdpJSAR.SpatialElement.Color3 {
  if (input == null) {
    return null;
  }
  return [input.r, input.g, input.b];
}

function toColor4(input: BABYLON.Color4): CdpJSAR.SpatialElement.Color4 {
  if (input == null) {
    return null;
  }
  return [input.r, input.g, input.b, input.a];
}

function toVector3(input: BABYLON.Vector3): CdpJSAR.SpatialElement.Vector3 {
  if (input == null) {
    return null;
  }
  return { x: input.x, y: input.y, z: input.z };
}

function toQuaternion(input: BABYLON.Quaternion): CdpJSAR.SpatialElement.Quaternion {
  if (input == null) {
    return null;
  }
  return { x: input.x, y: input.y, z: input.z, w: input.w };
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

  private _isLogEnabled: boolean = this._init?.log || false;
  private _domNodes: Map<number, NodeImpl> = new Map();
  private _highlightedMeshes: Set<BABYLON.AbstractMesh> = new Set();

  get Log() {
    return this.rootSession.api.Log;
  }

  get DOM() {
    return this.rootSession.api.DOM;
  }

  get SpatialDOM() {
    return this.rootSession.api.SpatialDOM;
  }

  constructor(
    private _transport: ITransport,
    private _window: BaseWindowImpl,
    private _init: WindowOrDOMInit<NativeDocument>['devtools']
  ) {
    this._server = Connection.server<CdpJSAR.Domains>(this._transport);
    this._server.rootSession.api = {
      Log: {
        enable: async (_client, _arg) => {
          this._isLogEnabled = true;
          return {};
        },
        disable: async (_client, _arg) => {
          this._isLogEnabled = false;
          return {};
        },
        async clear() {
          _window.console.clear();
          return {};
        },
        async startViolationsReport(_client, _arg) {
          return null;
        },
        async stopViolationsReport(_client, _arg) {
          return null;
        },
      },
      DOM: {
        async collectClassNamesFromSubtree(client, arg) {
          return null;
        },
        async copyTo(client, arg) {
          return null;
        },
        async describeNode(client, arg) {
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
      },
      SpatialDOM: {
        describeElement: async (_client, arg) => {
          const node = this._domNodes.get(arg.nodeId);
          if (node && isSpatialElement(node)) {
            const nativeHandle = node.asNativeType();
            const elementDescriptor: CdpJSAR.SpatialElement.Node = {
              nodeId: node._inspectorId,
              type: nativeHandle.getClassName(),
            };
            if (nativeHandle instanceof BABYLON.TransformNode) {
              elementDescriptor.transform = {
                position: toVector3(nativeHandle.position),
                rotation: toQuaternion(nativeHandle.rotationQuaternion),
                scaling: toVector3(nativeHandle.scaling),
              };
            }
            if (nativeHandle instanceof BABYLON.AbstractMesh) {
              elementDescriptor.mesh = {
                vertices: nativeHandle.getTotalVertices(),
                faces: nativeHandle.getTotalIndices() / 3,
                hasNormals: nativeHandle.isVerticesDataPresent(BABYLON.VertexBuffer.NormalKind),
                hasTangents: nativeHandle.isVerticesDataPresent(BABYLON.VertexBuffer.TangentKind),
                hasColors: nativeHandle.isVerticesDataPresent(BABYLON.VertexBuffer.ColorKind),
                hasUv0: nativeHandle.isVerticesDataPresent(BABYLON.VertexBuffer.UVKind),
                hasUv1: nativeHandle.isVerticesDataPresent(BABYLON.VertexBuffer.UV2Kind),
                hasUv2: nativeHandle.isVerticesDataPresent(BABYLON.VertexBuffer.UV3Kind),
                hasUv3: nativeHandle.isVerticesDataPresent(BABYLON.VertexBuffer.UV4Kind),
                hasUv4: nativeHandle.isVerticesDataPresent(BABYLON.VertexBuffer.UV5Kind),
              };
              elementDescriptor.material = {
                type: nativeHandle.material.getClassName(),
                name: nativeHandle.material.name,
              };
              if (nativeHandle.material instanceof BABYLON.StandardMaterial) {
                elementDescriptor.material.diffuseColor = toColor3(nativeHandle.material.diffuseColor);
                elementDescriptor.material.ambientColor = toColor3(nativeHandle.material.ambientColor);
                elementDescriptor.material.specularColor = toColor3(nativeHandle.material.specularColor);
                elementDescriptor.material.emissiveColor = toColor3(nativeHandle.material.emissiveColor);
              }
              if (nativeHandle.material instanceof BABYLON.PBRMaterial) {
                elementDescriptor.material.albedoColor = toColor3(nativeHandle.material.albedoColor);
                elementDescriptor.material.metallic = nativeHandle.material.metallic;
                elementDescriptor.material.roughness = nativeHandle.material.roughness;
              }
            }
            return {
              node: elementDescriptor,
            };
          }
          return { node: null };
        },
        highlightElement: async (_client, arg) => {
          const node = this._domNodes.get(arg.nodeId);
          if (node && isSpatialElement(node)) {
            const nativeHandle = node.asNativeType();
            if (nativeHandle instanceof BABYLON.AbstractMesh) {
              nativeHandle.renderOverlay = true;
              nativeHandle.overlayColor = BABYLON.Color3.White();
              this._highlightedMeshes.add(nativeHandle);
            }
          }
          return {};
        },
        unhighlightElement: async (_client, arg) => {
          const node = this._domNodes.get(arg.nodeId);
          if (node && isSpatialElement(node)) {
            const nativeHandle = node.asNativeType();
            if (nativeHandle instanceof BABYLON.AbstractMesh) {
              for (const highlighted of this._highlightedMeshes) {
                if (highlighted.uniqueId === nativeHandle.uniqueId) {
                  highlighted.renderOverlay = false;
                  this._highlightedMeshes.delete(highlighted);
                }
              }
            }
          }
          return {};
        },
        unhighlightElements: async (_client, arg) => {
          for (const highlighted of this._highlightedMeshes) {
            highlighted.renderOverlay = false;
          }
          this._highlightedMeshes.clear();
          return {};
        },
        setTransform: async (_client, arg) => {
          const node = this._domNodes.get(arg.nodeId);
          if (node && isSpatialElement(node)) {
            const nativeHandle = node.asNativeType();
            if (nativeHandle instanceof BABYLON.TransformNode) {
              if (arg.transform.position) {
                if (!isNaN(arg.transform.position.x)) {
                  nativeHandle.position.x = arg.transform.position.x;
                }
                if (!isNaN(arg.transform.position.y)) {
                  nativeHandle.position.y = arg.transform.position.y;
                }
                if (!isNaN(arg.transform.position.z)) {
                  nativeHandle.position.z = arg.transform.position.z;
                }
              }
              if (arg.transform.rotation) {
                if (!isNaN(arg.transform.rotation.x)) {
                  nativeHandle.rotationQuaternion.x = arg.transform.rotation.x;
                }
                if (!isNaN(arg.transform.rotation.y)) {
                  nativeHandle.rotationQuaternion.y = arg.transform.rotation.y;
                }
                if (!isNaN(arg.transform.rotation.z)) {
                  nativeHandle.rotationQuaternion.z = arg.transform.rotation.z;
                }
                if (!isNaN(arg.transform.rotation.w)) {
                  nativeHandle.rotationQuaternion.w = arg.transform.rotation.w;
                }
              }
              if (arg.transform.scaling) {
                if (!isNaN(arg.transform.scaling.x)) {
                  nativeHandle.scaling.x = arg.transform.scaling.x;
                }
                if (!isNaN(arg.transform.scaling.y)) {
                  nativeHandle.scaling.y = arg.transform.scaling.y;
                }
                if (!isNaN(arg.transform.scaling.z)) {
                  nativeHandle.scaling.z = arg.transform.scaling.z;
                }
              }
            }
          }
          return {};
        },
        displayMeshNormals: async (_client, _arg) => {
          return {};
        },
        displayMeshBones: async (_client, _arg) => {
          return {};
        },
        displayVertexNormals: async (_client, _arg) => {
          return {};
        },
        renderWireframeOverMesh: async (_client, _arg) => {
          return {};
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
    if (isElementNode(node)) {
      serialized.attributes = node.getAttributeNames().reduce<string[]>((flattenArrary, attrName) => {
        const attrValue = node.getAttribute(attrName);
        return [...flattenArrary, attrName, attrValue];
      }, []);
    }
    if (isAttributeNode(node)) {
      serialized.name = node.name;
      serialized.value = node.value;
    }
    return serialized;
  }

  writeLogEntry(
    level: 'verbose' | 'info' | 'warning' | 'error',
    text: string,
    source: 'javascript' | 'network' | 'appcache' | 'security' | 'other' = 'other',
    url: string = '',
  ) {
    if (this._isLogEnabled === false) {
      return;
    }
    const entry: CdpBrowser.Log.LogEntry = {
      source,
      level,
      text,
      timestamp: Date.now(),
      url,
      lineNumber: 0,
      stackTrace: null,
      networkRequestId: '',
      workerId: '',
      args: [],
    };
    this.rootSession.eventDispatcher.Log.entryAdded({ entry });
  }
}
