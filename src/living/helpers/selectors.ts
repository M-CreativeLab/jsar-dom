import nwsapi from 'nwsapi';
import DOMException from 'domexception';
import { NodeImpl } from '../nodes/Node';
import { ElementImpl } from '../nodes/Element';
import ParentNodeImpl from '../nodes/ParentNode';
import { isShadowRoot } from './shadow-dom';
import { isDocumentNode } from '../node-type';
import DOMExceptionImpl from '../domexception';
import DocumentOrShadowRootImpl from '../nodes/DocumentOrShadowRoot';

function initNwsapi(document: DocumentOrShadowRoot): nwsapi.NWSAPI {
  return nwsapi({
    document: document as Document,
    DOMException: DOMException as any,
  });
}

export function matchesDontThrow(elImpl: ElementImpl, selector: string) {
  const root = elImpl.getRootNode() as NodeImpl;
  if (!isShadowRoot(root) && !isDocumentNode(root)) {
    throw new DOMExceptionImpl(
      'The root node must be a ShadowRoot or Document.', 'INVALID_NODE_TYPE_ERR');
  }

  const rootImpl = root as DocumentOrShadowRootImpl;
  if (!rootImpl._nwsapiDontThrow) {
    const nwsapi = rootImpl._nwsapiDontThrow = initNwsapi(root);
    nwsapi.configure({
      LOGERRORS: false,
      IDS_DUPES: false,
      MIXEDCASE: true
    });
  }
  return rootImpl._nwsapiDontThrow.match(selector, elImpl);
}

export function addNwsapi(parentNode: ParentNodeImpl) {
  const root = parentNode.getRootNode() as NodeImpl;
  if (!isShadowRoot(root) && !isDocumentNode(root)) {
    throw new DOMExceptionImpl(
      'The root node must be a ShadowRoot or Document.', 'INVALID_NODE_TYPE_ERR');
  }

  const rootImpl = root as DocumentOrShadowRootImpl;
  if (!rootImpl._nwsapi) {
    const nwsapi = rootImpl._nwsapi = initNwsapi(root);
    nwsapi.configure({
      LOGERRORS: false,
      IDS_DUPES: false,
      MIXEDCASE: true
    });
  }
  return rootImpl._nwsapi;
}
