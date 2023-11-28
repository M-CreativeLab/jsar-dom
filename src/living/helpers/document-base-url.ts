import DOMException from '../domexception';
import { SpatialDocumentImpl } from '../nodes/SpatialDocument';

// https://html.spec.whatwg.org/multipage/infrastructure.html#document-base-url
export function documentBaseURL(document: SpatialDocumentImpl): URL {
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

// https://html.spec.whatwg.org/multipage/infrastructure.html#fallback-base-url
export function fallbackBaseURL(document: SpatialDocumentImpl): URL {
  // Unimplemented: <iframe srcdoc>
  if (document.URL === 'about:blank' && document._defaultView) {
    const firstBase = document.querySelector('base[href]');
    if (firstBase === null) {
      throw new DOMException('No base element with href attribute found on a "about:blank" document', 'NOT_FOUND_ERR');
    }
    return frozenBaseURL(firstBase);
  }
  return document._URL;
}

// https://html.spec.whatwg.org/#resolve-a-url
export function parseURLToResultingURLRecord(url: string, document: SpatialDocumentImpl): URL {
  const baseURL = documentBaseURL(document);
  return new URL(url, baseURL);
}

// https://html.spec.whatwg.org/multipage/semantics.html#frozen-base-url
// The spec is eager (setting the frozen base URL when things change); we are lazy (getting it when we need to)
function frozenBaseURL(baseElement: Element, fallbackBaseURL?: URL): URL {
  const baseHrefAttribute = baseElement.getAttributeNS(null, 'href');
  const result = new URL(baseHrefAttribute, fallbackBaseURL);
  return result === null ? fallbackBaseURL : result;
}
