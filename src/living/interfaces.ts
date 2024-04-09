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
let isVMModules = true;
if('NODE_OPTIONS' in process.env) {
    isVMModules = process.env.NODE_OPTIONS.includes('--experimental-vm-modules');
} else {
  isVMModules = false;
}

export async function loadImplementations() {
  return Promise.all([
    // Attributes
    isVMModules ? await import('./attributes/NamedNodeMap') : import('./attributes/NamedNodeMap'),
    isVMModules ? await import('./attributes/Attr') : import('./attributes/Attr'),
    // Classic Nodes
    isVMModules ? await import('./nodes/Node') : import('./nodes/Node'),
    isVMModules ? await import('./nodes/NodeList') : import('./nodes/NodeList'),
    isVMModules ? await import('./nodes/Element') : import('./nodes/Element'),
    isVMModules ? await import('./nodes/DocumentFragment') : import('./nodes/DocumentFragment'),
    isVMModules ? await import('./nodes/DocumentType') : import('./nodes/DocumentType'),
    isVMModules ? await import('./nodes/SpatialDocument') : import('./nodes/SpatialDocument'),
    isVMModules ? await import('./nodes/Text') : import('./nodes/Text'),
    isVMModules ? await import('./nodes/HTMLCollection') : import('./nodes/HTMLCollection'),
    isVMModules ? await import('./nodes/DOMTokenList') : import('./nodes/DOMTokenList'),
    isVMModules ? await import('./nodes/HTMLElement') : import('./nodes/HTMLElement'),
    isVMModules ? await import('./nodes/HTMLContentElement') : import('./nodes/HTMLContentElement'),
    isVMModules ? await import('./nodes/HTMLHeadElement') : import('./nodes/HTMLHeadElement'),
    isVMModules ? await import('./nodes/HTMLTitleElement') : import('./nodes/HTMLTitleElement'),
    isVMModules ? await import('./nodes/HTMLMetaElement') : import('./nodes/HTMLMetaElement'),
    isVMModules ? await import('./nodes/HTMLStyleElement') : import('./nodes/HTMLStyleElement'),
    isVMModules ? await import('./nodes/HTMLScriptElement') : import('./nodes/HTMLScriptElement'),
    isVMModules ? await import('./nodes/HTMLDivElement') : import('./nodes/HTMLDivElement'),
    isVMModules ? await import('./nodes/HTMLSpanElement') : import('./nodes/HTMLSpanElement'),
    isVMModules ? await import('./nodes/HTMLImageElement') : import('./nodes/HTMLImageElement'),
    // Spatial Nodes
    isVMModules ? await import('./nodes/SpatialElement') : import('./nodes/SpatialElement'),
    // CSSOM
    isVMModules ? await import('./cssom/StyleSheetList') : import('./cssom/StyleSheetList'),
    // Events
    isVMModules ? await import('./events/CloseEvent') : import('./events/CloseEvent'),
    isVMModules ? await import('./events/CustomEvent') : import('./events/CustomEvent'),
    isVMModules ? await import('./events/ErrorEvent') : import('./events/ErrorEvent'),
    isVMModules ? await import('./events/FocusEvent') : import('./events/FocusEvent'),
    isVMModules ? await import('./events/HashChangeEvent') : import('./events/HashChangeEvent'),
    isVMModules ? await import('./events/KeyboardEvent') : import('./events/KeyboardEvent'),
    isVMModules ? await import('./events/MessageEvent') : import('./events/MessageEvent'),
    isVMModules ? await import('./events/MouseEvent') : import('./events/MouseEvent'),
    isVMModules ? await import('./events/PopStateEvent') : import('./events/PopStateEvent'),
    isVMModules ? await import('./events/ProgressEvent') : import('./events/ProgressEvent'),
    isVMModules ? await import('./events/TouchEvent') : import('./events/TouchEvent'),
    isVMModules ? await import('./events/UIEvent') : import('./events/UIEvent'),
    // Others
    isVMModules ? await import('./domexception') : import('./domexception'),
    isVMModules ? await import('./custom-elements/CustomElementRegistry') : import('./custom-elements/CustomElementRegistry'),
    isVMModules ? await import('./hr-time/Performance') : import('./hr-time/Performance'),
    isVMModules ? await import('./range/AbstractRange') : import('./range/AbstractRange'),
    isVMModules ? await import('./range/Range') : import('./range/Range'),
    isVMModules ? await import('./mutation-observer/MutationObserver') : import('./mutation-observer/MutationObserver'),
    isVMModules ? await import('./mutation-observer/MutationRecord') : import('./mutation-observer/MutationRecord'),
    isVMModules ? await import('./crypto/Noise') : import('./crypto/Noise'),
    isVMModules ? await import('./geometry/DOMPoint') : import('./geometry/DOMPoint'),
    isVMModules ? await import('./geometry/DOMPointReadOnly') : import('./geometry/DOMPointReadOnly'),
    isVMModules ? await import('./geometry/DOMRect') : import('./geometry/DOMRect'),
    isVMModules ? await import('./geometry/DOMRectReadOnly') : import('./geometry/DOMRectReadOnly'),
    isVMModules ? await import('./image/ImageData') : import('./image/ImageData'),
    // WebXR
    isVMModules ? await import('./xr/XRPose') : import('./xr/XRPose'),
    isVMModules ? await import('./xr/XRRigidTransform') : import('./xr/XRRigidTransform'),
    isVMModules ? await import('./xr/XRSession') : import('./xr/XRSession'),
    ]).then(([
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
