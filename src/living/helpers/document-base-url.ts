import { SpatialDocumentImpl } from '../nodes/SpatialDocument';

export function documentBaseURL(document: SpatialDocumentImpl): URL {
  // https://html.spec.whatwg.org/multipage/infrastructure.html#document-base-url
  const firstBase = document.querySelector('base[href]');
  const fallback = fallbackBaseURL(document);
  if (firstBase === null) {
    return fallback;
  }
  return frozenBaseURL(firstBase, fallback);
}

export function documentBaseURLSerialized(document: SpatialDocumentImpl): string {
  return documentBaseURL(document).href;
}

export function fallbackBaseURL(document: SpatialDocumentImpl): URL {
  // https://html.spec.whatwg.org/multipage/infrastructure.html#fallback-base-url
  // Unimplemented: <iframe srcdoc>
  if (document.URL === 'about:blank' && document._defaultView) {
    return documentBaseURL(document);
  }
  return document._URL;
}

function frozenBaseURL(baseElement: Element, fallbackBaseURL: URL): URL {
  // https://html.spec.whatwg.org/multipage/semantics.html#frozen-base-url
  // The spec is eager (setting the frozen base URL when things change); we are lazy (getting it when we need to)

  const baseHrefAttribute = baseElement.getAttributeNS(null, 'href');
  const result = new URL(baseHrefAttribute, fallbackBaseURL);
  return result === null ? fallbackBaseURL : result;
}
