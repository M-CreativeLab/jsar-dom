import type NamedNodeMapImpl from './attributes/NamedNodeMap';
import type { NodeImpl } from './nodes/Node';
import type { ElementImpl } from './nodes/Element';
import type { HTMLElementImpl } from './nodes/HTMLElement';
import type { HTMLContentElement } from './nodes/HTMLContentElement';
import type HTMLStyleElementImpl from './nodes/HTMLStyleElement';
import type HTMLScriptElementImpl from './nodes/HTMLScriptElement';
import type HTMLImageElementImpl from './nodes/HTMLImageElement';
import type { SpatialElement } from './nodes/SpatialElement';
import type ImageDataImpl from './image/ImageData';
import type NoiseImpl from './crypto/Noise';
import type DOMPointImpl from './geometry/DOMPoint';
import type DOMPointReadOnlyImpl from './geometry/DOMPointReadOnly';
import type DOMRectImpl from './geometry/DOMRect';
import type DOMRectReadOnlyImpl from './geometry/DOMRectReadOnly';
import type XRPoseImpl from './xr/XRPose';
import type XRRigidTransformImpl from './xr/XRRigidTransform';
import type XRSessionImpl from './xr/XRSession';

let implementationLoaded = false;
const implementedInterfaces = new Map<string, any>();

/**
 * To load all the implementations of the interfaces.
 * 
 * __Why?__
 * In TypeScript, avoiding circular dependencies is a challenging task, requiring constant 
 * attention to the order of dependencies and sometimes necessitating the splitting of modules 
 * to ensure no circular dependencies. This is due to the fact that the TypeScript compiler (tsc) 
 * resolves dependencies based on file order, leading to compromises in project directory design.
 *
 * To address this issue, we introduce the following method: leveraging dynamic `imports()` for 
 * asynchronous loading of type instances. Subsequently, we use a synchronous function, 
 * `getInterfaceWrapper`, to ensure the smooth functioning of the type system. This approach 
 * ensures that, during both build time and runtime, the necessary precautions are taken to 
 * guarantee correct invocation of the function when utilizing related interfaces.
 */

async function importImplementations(modulePaths: string[], isParallel: boolean) {
  if (isParallel === false) {
    return Promise.all(modulePaths.map((path) => import(path)));
  } else {
    const impls = [];
    for (const path of modulePaths) {
      impls.push(await import(path));
    }
    return impls;
  }
}

export async function loadImplementations(isParallel: boolean = false) {
  await importImplementations([
    // Attributes
    './attributes/NamedNodeMap',
    './attributes/Attr',
    // Classic Nodes
    './nodes/Node',
    './nodes/NodeList',
    './nodes/Element',
    './nodes/DocumentFragment',
    './nodes/DocumentType',
    './nodes/SpatialDocument',
    './nodes/Text',
    './nodes/HTMLCollection',
    './nodes/DOMTokenList',
    './nodes/HTMLElement',
    './nodes/HTMLContentElement',
    './nodes/HTMLHeadElement',
    './nodes/HTMLTitleElement',
    './nodes/HTMLMetaElement',
    './nodes/HTMLStyleElement',
    './nodes/HTMLScriptElement',
    './nodes/HTMLDivElement',
    './nodes/HTMLSpanElement',
    './nodes/HTMLImageElement',
    // Spatial Nodes
    './nodes/SpatialElement',
    // CSSOM
    './cssom/StyleSheetList',
    // Events
    './events/CloseEvent',
    './events/CustomEvent',
    './events/ErrorEvent',
    './events/FocusEvent',
    './events/HashChangeEvent',
    './events/KeyboardEvent',
    './events/MessageEvent',
    './events/MouseEvent',
    './events/PopStateEvent',
    './events/ProgressEvent',
    './events/TouchEvent',
    './events/UIEvent',
    // Others
    './domexception',
    './custom-elements/CustomElementRegistry',
    './hr-time/Performance',
    './range/AbstractRange',
    './range/Range',
    './mutation-observer/MutationObserver',
    './mutation-observer/MutationRecord',
    './crypto/Noise',
    './geometry/DOMPoint',
    './geometry/DOMPointReadOnly',
    './geometry/DOMRect',
    './geometry/DOMRectReadOnly',
    './image/ImageData',
    // WebXR
    './xr/XRPose',
    './xr/XRRigidTransform',
    './xr/XRSession'
    ], isParallel).then(([
    // Attributes
    NamedNodeMapImpl,
    { AttrImpl },
    // Nodes
    { NodeImpl },
    { NodeListImpl },
    { ElementImpl },
    DocumentFragmentImpl,
    { DocumentTypeImpl },
    { SpatialDocumentImpl },
    { TextImpl },
    HTMLCollectionImpl,
    DOMTokenListImpl,
    { HTMLElementImpl },
    { HTMLContentElement: HTMLContentElementImpl },
    HTMLHeadElementImpl,
    HTMLTitleElementImpl,
    HTMLMetaElementImpl,
    HTMLStyleElementImpl,
    HTMLScriptElementImpl,
    HTMLDivElementImpl,
    HTMLSpanElementImpl,
    HTMLImageElementImpl,
    // Spatial Nodes
    { SpatialElement },
    // CSSOM
    StyleSheetListImpl,
    // Events
    { CloseEventImpl },
    { CustomEventImpl },
    ErrorEventImpl,
    FocusEventImpl,
    HashChangeEventImpl,
    KeyboardEventImpl,
    MessageEventImpl,
    MouseEventImpl,
    PopStateEventImpl,
    ProgressEventImpl,
    TouchEventImpl,
    { UIEventImpl },
    // Others
    DOMExceptionImpl,
    { CustomElementRegistryImpl },
    { PerformanceImpl },
    { AbstractRangeImpl },
    { RangeImpl },
    { MutationObserverImpl },
    { MutationRecordImpl },
    NoiseImpl,
    DOMPointImpl,
    DOMPointReadOnlyImpl,
    DOMRectImpl,
    DOMRectReadOnlyImpl,
    ImageDataImpl,
    // WebXR
    XRPoseImpl,
    XRRigidTransformImpl,
    XRSessionImpl,
  ]) => {
    implementedInterfaces.set('NamedNodeMap', NamedNodeMapImpl.default);
    implementedInterfaces.set('Attr', AttrImpl);
    implementedInterfaces.set('Node', NodeImpl);
    implementedInterfaces.set('NodeList', NodeListImpl);
    implementedInterfaces.set('Element', ElementImpl);
    implementedInterfaces.set('DocumentFragment', DocumentFragmentImpl);
    implementedInterfaces.set('DocumentType', DocumentTypeImpl);
    implementedInterfaces.set('SpatialDocument', SpatialDocumentImpl);
    implementedInterfaces.set('Text', TextImpl);
    implementedInterfaces.set('HTMLCollection', HTMLCollectionImpl);
    implementedInterfaces.set('DOMTokenList', DOMTokenListImpl);
    implementedInterfaces.set('HTMLElement', HTMLElementImpl);
    implementedInterfaces.set('HTMLContentElement', HTMLContentElementImpl);
    implementedInterfaces.set('HTMLHeadElement', HTMLHeadElementImpl);
    implementedInterfaces.set('HTMLTitleElement', HTMLTitleElementImpl);
    implementedInterfaces.set('HTMLMetaElement', HTMLMetaElementImpl);
    implementedInterfaces.set('HTMLStyleElement', HTMLStyleElementImpl.default);
    implementedInterfaces.set('HTMLScriptElement', HTMLScriptElementImpl.default);
    implementedInterfaces.set('HTMLDivElement', HTMLDivElementImpl.default);
    implementedInterfaces.set('HTMLSpanElement', HTMLSpanElementImpl.default);
    implementedInterfaces.set('HTMLImageElement', HTMLImageElementImpl.default);
    implementedInterfaces.set('SpatialElement', SpatialElement);
    implementedInterfaces.set('StyleSheetList', StyleSheetListImpl.default);
    implementedInterfaces.set('CloseEvent', CloseEventImpl);
    implementedInterfaces.set('CustomEvent', CustomEventImpl);
    implementedInterfaces.set('ErrorEvent', ErrorEventImpl);
    implementedInterfaces.set('FocusEvent', FocusEventImpl);
    implementedInterfaces.set('HashChangeEvent', HashChangeEventImpl);
    implementedInterfaces.set('KeyboardEvent', KeyboardEventImpl);
    implementedInterfaces.set('MessageEvent', MessageEventImpl);
    implementedInterfaces.set('MouseEvent', MouseEventImpl);
    implementedInterfaces.set('PopStateEvent', PopStateEventImpl);
    implementedInterfaces.set('ProgressEvent', ProgressEventImpl);
    implementedInterfaces.set('TouchEvent', TouchEventImpl);
    implementedInterfaces.set('UIEvent', UIEventImpl);  
    implementedInterfaces.set('DOMException', DOMExceptionImpl);
    implementedInterfaces.set('CustomElementRegistry', CustomElementRegistryImpl);
    implementedInterfaces.set('Performance', PerformanceImpl);
    implementedInterfaces.set('AbstractRange', AbstractRangeImpl);
    implementedInterfaces.set('Range', RangeImpl);
    implementedInterfaces.set('MutationObserver', MutationObserverImpl);
    implementedInterfaces.set('MutationRecord', MutationRecordImpl);
    implementedInterfaces.set('Noise', NoiseImpl.default);
    implementedInterfaces.set('DOMPoint', DOMPointImpl.default);
    implementedInterfaces.set('DOMPointReadOnly', DOMPointReadOnlyImpl.default);
    implementedInterfaces.set('DOMRect', DOMRectImpl.default);
    implementedInterfaces.set('DOMRectReadOnly', DOMRectReadOnlyImpl.default);
    implementedInterfaces.set('ImageData', ImageDataImpl.default);
    implementedInterfaces.set('XRPose', XRPoseImpl.default);
    implementedInterfaces.set('XRRigidTransform', XRRigidTransformImpl.default);
    implementedInterfaces.set('XRSession', XRSessionImpl.default);
    implementationLoaded = true;
  });
}

// TODO: help me to fullfill the other interfaces
export function getInterfaceWrapper(name: 'NamedNodeMap'): typeof NamedNodeMapImpl;
export function getInterfaceWrapper(name: 'Node'): typeof NodeImpl;
export function getInterfaceWrapper(name: 'Element'): typeof ElementImpl;
export function getInterfaceWrapper(name: 'HTMLElement'): typeof HTMLElementImpl;
export function getInterfaceWrapper(name: 'HTMLContentElement'): typeof HTMLContentElement;
export function getInterfaceWrapper(name: 'HTMLStyleElement'): typeof HTMLStyleElementImpl;
export function getInterfaceWrapper(name: 'HTMLScriptElement'): typeof HTMLScriptElementImpl;
export function getInterfaceWrapper(name: 'HTMLImageElement'): typeof HTMLImageElementImpl;
export function getInterfaceWrapper(name: 'SpatialElement'): typeof SpatialElement;
export function getInterfaceWrapper(name: 'Noise'): typeof NoiseImpl;
export function getInterfaceWrapper(name: 'DOMPoint'): typeof DOMPointImpl;
export function getInterfaceWrapper(name: 'DOMPointReadOnly'): typeof DOMPointReadOnlyImpl;
export function getInterfaceWrapper(name: 'DOMRect'): typeof DOMRectImpl;
export function getInterfaceWrapper(name: 'DOMRectReadOnly'): typeof DOMRectReadOnlyImpl;
export function getInterfaceWrapper(name: 'ImageData'): typeof ImageDataImpl
export function getInterfaceWrapper(name: 'XRPose'): typeof XRPoseImpl;
export function getInterfaceWrapper(name: 'XRRigidTransform'): typeof XRRigidTransformImpl;
export function getInterfaceWrapper(name: 'XRSession'): typeof XRSessionImpl;
export function getInterfaceWrapper(name: string): any;
export function getInterfaceWrapper(name: string) {
  if (!implementationLoaded) {
    throw new Error('DOM Implementation not loaded');
  }
  return implementedInterfaces.get(name);
}
