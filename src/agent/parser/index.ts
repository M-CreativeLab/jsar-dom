import { SpatialDocumentImpl } from '../../living/nodes/SpatialDocument';
import * as xsmlParser from './xsml';

type parseFragment = (markup: string, contextElement: HTMLElement) => void;
type parseIntoDocument = (markup: string, ownerDocument: SpatialDocumentImpl) => void;

export function parseFragment(markup: string, contextElement: HTMLElement) {
  // TODO
}

export function parseIntoDocument(markup: string, ownerDocument: SpatialDocumentImpl) {
  const { _parsingMode } = ownerDocument;

  let parseAlgorithm: parseIntoDocument;
  if (_parsingMode === 'xsml' || _parsingMode === 'html') {
    parseAlgorithm = xsmlParser.parseIntoDocument;
  } else {
    throw new Error('Unrecognized parsing mode');
  }
  return parseAlgorithm(markup, ownerDocument);
}
