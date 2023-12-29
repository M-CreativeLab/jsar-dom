import { NativeDocument } from '../../impl-interfaces';
import DOMException from '../domexception';
import { HTMLElementImpl } from './HTMLElement';
import path from 'path';

const contentTypesArrayToPreload = [
  'audio',
  'document',
  'embed',
  'fetch',
  'font',
  'image',
  'object',
  'script',
  'style',
  'track',
  'video',
  'worker',
  'spatial-model',
  'spatial-mesh',
  'spatial-material',
] as const;
const relTypesArray = [
  // Alternate representations of the current document.
  'alternate',
  // Author of the current document or article.
  'author',
  // Tells the browser to preemptively perform DNS resolution for the target resource's origin.
  'dns-prefetch',
  // Link to context-sensitive help.
  'help',
  // An icon representing the current document.
  'icon',
  // Indicates that the main content of the current document is covered by the copyright license described by the referenced document.
  'license',
  // Indicates that the current document is a part of a series and that the next document in the series is the referenced document.
  'next',
  // Gives the address of the pingback server that handles pingbacks to the current document.
  'pingback',
  // Specifies that the user agent should preemptively connect to the target resource's origin.
  'preconnect',
  // Specifies that the user agent should preemptively fetch and cache the target resource as it is likely to be required for a followup 
  // navigation.
  'prefetch',
  // Specifies that the user agent must preemptively fetch and cache the target resource for current navigation according to the potential 
  // destination given by the as attribute (and the priority associated with the corresponding destination).
  'preload',
  // Specifies that the user agent should preemptively fetch the target resource and process it in a way that helps deliver a faster response 
  // in the future.
  'prerender',
  // Indicates that the current document is a part of a series and that the previous document in the series is the referenced document.
  'prev',
  // Gives a link to a resource that can be used to search through the current document and its related pages.
  'search',
  // Imports a style sheet.
  'stylesheet',
  /**
   * The followings are not in the DOM spec and added by JSAR-DOM.
   **/
  // Imports a spatial model object like "glb/gltf".
  'spatial-model',
  'mesh', // will deprecate, use 'spatial-model' instead
] as const;

type ContentTypeToPreload = typeof contentTypesArrayToPreload[number];
type RelType = typeof relTypesArray[number];
type CrossOriginValue = 'anonymous' | 'use-credentials';

function isRelSupported(rel: RelType): boolean {
  return [
    'stylesheet',
    'mesh',
    'spatial-model',
  ].includes(rel);
}

export default class HTMLLinkElementImpl extends HTMLElementImpl implements HTMLLinkElement {
  disabled: boolean;
  imageSizes: string;
  imageSrcset: string;
  integrity: string;
  media: string;
  referrerPolicy: string;
  relList: DOMTokenList;
  sizes: DOMTokenList;
  target: string;
  sheet: CSSStyleSheet;

  constructor(
    hostObject: NativeDocument,
    args,
    privateData = null
  ) {
    super(hostObject, args, { localName: 'link' });
  }

  get as(): string {
    return this.getAttribute('as');
  }
  set as(value: string) {
    if (!contentTypesArrayToPreload.includes(value as ContentTypeToPreload)) {
      throw new DOMException(`Invalid value(${value}) for as attribute`, 'INVALID_STATE_ERR');
    }
    this.setAttribute('as', value);
  }

  get charset(): string {
    throw new DOMException('charset is an obsolete attribute, it is not allowed to use.', 'NOT_SUPPORTED_ERR');
  }

  get crossOrigin(): CrossOriginValue {
    return this.getAttribute('crossorigin') as CrossOriginValue;
  }
  set crossOrigin(value: CrossOriginValue) {
    this.setAttribute('crossorigin', value);
  }

  get href(): string {
    return this.getAttribute('href');
  }
  set href(value: string) {
    this.setAttribute('href', value);
  }

  get hreflang(): string {
    return this.getAttribute('hreflang');
  }
  set hreflang(value: string) {
    this.setAttribute('hreflang', value);
  }

  get rel(): RelType {
    return this.getAttribute('rel') as RelType;
  }
  set rel(value: RelType) {
    this.setAttribute('rel', value);
  }

  get rev(): string {
    throw new DOMException('rev is an obsolete attribute, it is not allowed to use.', 'NOT_SUPPORTED_ERR');
  }


  get type(): string {
    return this.getAttribute('type');
  }
  set type(value: string) {
    this.setAttribute('type', value);
  }

  _attach(): void {
    super._attach();

    /**
     * FIXME: remove this unnecessary check?
     */
    if (!isRelSupported(this.rel)) {
      /**
       * If not supported, just return.
       */
      return;
    }

    switch (this.rel) {
      case 'stylesheet':
        this._loadStylesheet();
        break;
      case 'mesh':
      case 'spatial-model':
        this._loadSpatialModel();
        break;
      default:
        break;
    }
  }

  private _loadStylesheet() {
    throw new DOMException('Not implemented yet.', 'NOT_SUPPORTED_ERR');
  }

  private _loadSpatialModel() {
    const id = this.getAttribute('id');
    if (id == null) {
      throw new DOMException('The id attribute is required for spatial-model.', 'INVALID_STATE_ERR');
    }

    this._ownerDocument._preloadingSpatialModelObservers.set(
      id,
      new Promise<boolean>(async (resolve, reject) => {
        try {
          const nativeDocument = this._hostObject;
          const url = new URL(this.href, this._ownerDocument._URL);
          const resArrayBuffer = await nativeDocument.userAgent.resourceLoader.fetch(url.href, {}, 'arraybuffer');
          const extname = path.extname(url.pathname);
          const importedResult = await BABYLON.SceneLoader.ImportMeshAsync(
            '',
            '',
            new Uint8Array(resArrayBuffer, 0, resArrayBuffer.byteLength),
            nativeDocument.getNativeScene(),
            null,
            extname
          );

          this._ownerDocument._defaultView._createAssetsBundle(
            id, importedResult, extname === '.gltf' || extname === '.glb');
          resolve(true);

        } catch (err) {
          reject(new DOMException(`Failed to load spatial model(${this.href}): ${err.message}`, 'INVALID_STATE_ERR'));
        }
      })
    );
  }
}
