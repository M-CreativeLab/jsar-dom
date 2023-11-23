import DOMException from 'domexception';
import * as xnv from 'xml-name-validator';
import { XMLNS_NS, XML_NS } from './namespaces';

export function name(name: string) {
  if (!xnv.name(name)) {
    throw new DOMException(
      `"${name}" did not match the Name production`,
      'InvalidCharacterError');
  }
}

export function qname(qname: string) {
  if (!xnv.qname(qname)) {
    throw new DOMException(
      `"${qname}" did not match the QName production`,
      'InvalidCharacterError');
  }
}

export function validateAndExtract(namespace: string | null, qualifiedName: string) {
  if (namespace === '') {
    namespace = null;
  }
  qname(qualifiedName);

  let prefix: string | null = null;
  let localName = qualifiedName;

  const colonIndex = qualifiedName.indexOf(':');
  if (colonIndex !== -1) {
    prefix = qualifiedName.substring(0, colonIndex);
    localName = qualifiedName.substring(colonIndex + 1);
  }

  if (prefix !== null && namespace === null) {
    throw new DOMException(
      'A namespace was given but a prefix was also extracted from the qualifiedName',
      'NamespaceError'
    );
  }

  if (prefix === 'xml' && namespace !== XML_NS) {
    throw new DOMException(
      'A prefix of \"xml\" was given but the namespace was not the XML namespace',
      'NamespaceError'
    );
  }

  if ((qualifiedName === 'xmlns' || prefix === 'xmlns') && namespace !== XMLNS_NS) {
    throw new DOMException(
      'A prefix or qualifiedName of \"xmlns\" was given but the namespace was not the XMLNS namespace',
      'NamespaceError'
    );
  }

  if (namespace === XMLNS_NS && qualifiedName !== 'xmlns' && prefix !== 'xmlns') {
    throw new DOMException(
      'The XMLNS namespace was given but neither the prefix nor qualifiedName was \"xmlns\"',
      'NamespaceError'
    );
  }
  return { namespace, prefix, localName };
}
