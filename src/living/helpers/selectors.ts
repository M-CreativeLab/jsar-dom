import nwsapi from 'nwsapi';
import DOMException from 'domexception';
import { NodeImpl } from '../nodes/Node';
import { ElementImpl } from '../nodes/Element';
import ParentNodeImpl from '../nodes/ParentNode';

function initNwsapi(node: NodeImpl): nwsapi.NWSAPI {
  return nwsapi({
    document: node._ownerDocument,
    DOMException: DOMException as any,
  });
}

export function matchesDontThrow(elImpl: ElementImpl, selector: string) {
  const document = elImpl._ownerDocument;
  if (!document._nwsapiDontThrow) {
    document._nwsapiDontThrow = initNwsapi(elImpl);
    document._nwsapiDontThrow.configure({
      IDS_DUPES: false,
      MIXEDCASE: true,
      LOGERRORS: false,
      VERBOSITY: false,
    });
  }
  return document._nwsapiDontThrow.match(selector, elImpl);
}

export function addNwsapi(parentNode: ParentNodeImpl) {
  const document = parentNode._ownerDocument;
  if (!document._nwsapi) {
    document._nwsapi = initNwsapi(parentNode);
    document._nwsapi.configure({
      LOGERRORS: false,
      IDS_DUPES: false,
      MIXEDCASE: true
    });
  }
  return document._nwsapi;
}
