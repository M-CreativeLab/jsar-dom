import { NodeImpl } from "../nodes/Node";
import { SpatialDocumentImpl } from "../nodes/SpatialDocument";

type SerializationOptions = {
  outer: boolean;
  requireWellFormed: boolean;
  globalObject: any;
};

export function fragmentSerialization(node: NodeImpl, options: SerializationOptions) {
  let contextDocument: SpatialDocumentImpl;
  if (node.nodeType === NodeImpl.DOCUMENT_NODE) {
    contextDocument = node as SpatialDocumentImpl;
  } else {
    contextDocument = node._ownerDocument
  }

  if (contextDocument._parsingMode === 'html') {
    // TODO
  }
  return null;
}
