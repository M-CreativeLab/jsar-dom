import { SpatialDocumentImpl } from '../nodes/SpatialDocument';

export function documentBaseURL(document: SpatialDocumentImpl): URL {
  // https://html.spec.whatwg.org/multipage/infrastructure.html#document-base-url
  const firstBase = document.querySelector("base[href]");
  const fallbackBaseURL = exports.fallbackBaseURL(document);
  if (firstBase === null) {
    return fallbackBaseURL;
  }
  return frozenBaseURL(firstBase, fallbackBaseURL);
}

export function documentBaseURLSerialized(document: SpatialDocumentImpl): string {
  return documentBaseURL(document).href;
}

function frozenBaseURL(baseElement: Element, fallbackBaseURL: URL): URL {
  // https://html.spec.whatwg.org/multipage/semantics.html#frozen-base-url
  // The spec is eager (setting the frozen base URL when things change); we are lazy (getting it when we need to)

  const baseHrefAttribute = baseElement.getAttributeNS(null, 'href');
  const result = new URL(baseHrefAttribute, fallbackBaseURL);
  return result === null ? fallbackBaseURL : result;
}
