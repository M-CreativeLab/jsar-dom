type DOMExceptionName =
  'INDEX_SIZE_ERR' |
  'DOMSTRING_SIZE_ERR' |
  'HIERARCHY_REQUEST_ERR' |
  'WRONG_DOCUMENT_ERR' |
  'INVALID_CHARACTER_ERR' |
  'NO_DATA_ALLOWED_ERR' |
  'NO_MODIFICATION_ALLOWED_ERR' |
  'NOT_FOUND_ERR' |
  'NOT_SUPPORTED_ERR' |
  'INUSE_ATTRIBUTE_ERR' |
  'INVALID_STATE_ERR' |
  'SYNTAX_ERR' |
  'INVALID_MODIFICATION_ERR' |
  'NAMESPACE_ERR' |
  'INVALID_ACCESS_ERR' |
  'VALIDATION_ERR' |
  'TYPE_MISMATCH_ERR' |
  'SECURITY_ERR' |
  'NETWORK_ERR' |
  'ABORT_ERR' |
  'URL_MISMATCH_ERR' |
  'QUOTA_EXCEEDED_ERR' |
  'TIMEOUT_ERR' |
  'INVALID_NODE_TYPE_ERR' |
  'DATA_CLONE_ERR';

class DOMExceptionImpl extends TypeError implements DOMException {
  /**
   * Error code indicating that an index is out of range or not valid.
   */
  INDEX_SIZE_ERR: 1;
  /**
   * The DOMSTRING_SIZE_ERR constant represents an error code indicating that the resulting string is too long to be stored in a DOMString.
   */
  DOMSTRING_SIZE_ERR: 2;
  /**
   * Error code indicating a hierarchy request error.
   */
  HIERARCHY_REQUEST_ERR: 3;
  /**
   * Error code indicating that a node is used in a different document than the one it was created in.
   */
  WRONG_DOCUMENT_ERR: 4;
  /**
   * Error code indicating an invalid character.
   */
  INVALID_CHARACTER_ERR: 5;
  /**
   * Error code indicating that data is not allowed.
   */
  NO_DATA_ALLOWED_ERR: 6;
  /**
   * Error code indicating that the modification is not allowed.
   */
  NO_MODIFICATION_ALLOWED_ERR: 7;
  /**
   * Error code indicating that the requested item was not found.
   */
  NOT_FOUND_ERR: 8;
  /**
   * Error code indicating that the operation is not supported.
   */
  NOT_SUPPORTED_ERR: 9;
  /**
   * Error code indicating that an attribute is already in use.
   */
  INUSE_ATTRIBUTE_ERR: 10;
  /**
   * Error code indicating an invalid state.
   */
  INVALID_STATE_ERR: 11;
  /**
   * The SYNTAX_ERR constant represents an error code indicating a syntax error.
   */
  SYNTAX_ERR: 12;
  /**
   * Error code indicating an invalid modification error.
   */
  INVALID_MODIFICATION_ERR: 13;
  /**
   * Error code indicating a namespace error.
   */
  NAMESPACE_ERR: 14;
  /**
   * Error code indicating an invalid access error.
   */
  INVALID_ACCESS_ERR: 15;
  /**
   * The validation error code.
   */
  VALIDATION_ERR: 16;
  /**
   * Error code indicating a type mismatch.
   */
  TYPE_MISMATCH_ERR: 17;
  /**
   * Error code indicating a security-related error.
   */
  SECURITY_ERR: 18;
  /**
   * Error code indicating a network error.
   */
  NETWORK_ERR: 19;
  /**
   * The ABORT_ERR constant represents an error code indicating that the operation was aborted.
   */
  ABORT_ERR: 20;
  /**
   * Error code indicating a URL mismatch.
   */
  URL_MISMATCH_ERR: 21;
  /**
   * Error code indicating that the operation failed because the quota was exceeded.
   */
  QUOTA_EXCEEDED_ERR: 22;
  /**
   * The error code for a timeout error.
   */
  TIMEOUT_ERR: 23;
  /**
   * Error code indicating an invalid node type.
   */
  INVALID_NODE_TYPE_ERR: 24;
  /**
   * Error code indicating that the data being cloned has an unsupported type.
   */
  DATA_CLONE_ERR: 25;
  /**
   * The error code associated with the DOM exception.
   */
  code: number;

  constructor(message: string, name: DOMExceptionName) {
    super(message);
    this.name = name;
    this.code = DOMExceptionImpl[name];
  }
}

export default DOMExceptionImpl;
