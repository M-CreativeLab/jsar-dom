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
import type DOMMatrixImpl from './geometry/DOMMatrix';
import type XRPoseImpl from './xr/XRPose';
import type XRRigidTransformImpl from './xr/XRRigidTransform';
import type XRSessionImpl from './xr/XRSession';
let implementationLoaded = false;
const implementedInterfaces = new Map<string, any>();
/*
  To load all the implementations of the interfaces.
  *
  * __Why?__
  * In TypeScript, avoiding circular dependencies is a challenging task, requiring constant 
  * attention to the order of dependencies and sometimes necessitating the splitting of modules 
  * to ensure no circular dependencies. This is due to the fact that the TypeScript compiler (tsc) 
  * resolves dependencies based on file order, leading to compromises in project directory design. 
  * 
  * To address this issue, we introduce the following method:
  * leveraging dynamic imports() for asynchronous loading of type instances. Subsequently, we use a synchronous function,
  * getInterfaceWrapper, to ensure the smooth functioning of the type system. This approach 
  * ensures that, during both build time and runtime, the necessary precautions are taken to 
  * guarantee correct invocation of the function when utilizing related interfaces. 
  * 
  * solve the issue https://github.com/jestjs/jest/issues/11434 
  * by importing modules dynamically either in parallel or sequentially based on the isParallel flag. 
  * @param running parallel or not 
*/
export async function loadImplementations(isParallel = true) {
  let modules;
  if (isParallel) {
    modules = Promise.all([import("./attributes/NamedNodeMap"), import("./attributes/Attr"), import("./nodes/Node"), import("./nodes/NodeList"), import("./nodes/Element"), import("./nodes/DocumentFragment"), import("./nodes/DocumentType"), import("./nodes/SpatialDocument"), import("./nodes/Text"), import("./nodes/HTMLCollection"), import("./nodes/DOMTokenList"), import("./nodes/HTMLElement"), import("./nodes/HTMLContentElement"), import("./nodes/HTMLHeadElement"), import("./nodes/HTMLTitleElement"), import("./nodes/HTMLMetaElement"), import("./nodes/HTMLStyleElement"), import("./nodes/HTMLScriptElement"), import("./nodes/HTMLDivElement"), import("./nodes/HTMLSpanElement"), import("./nodes/HTMLImageElement"), import("./nodes/SpatialElement"), import("./cssom/StyleSheetList"), import("./events/CloseEvent"), import("./events/CustomEvent"), import("./events/ErrorEvent"), import("./events/FocusEvent"), import("./events/HashChangeEvent"), import("./events/KeyboardEvent"), import("./events/MessageEvent"), import("./events/MouseEvent"), import("./events/PopStateEvent"), import("./events/ProgressEvent"), import("./events/TouchEvent"), import("./events/UIEvent"), import("./domexception"), import("./custom-elements/CustomElementRegistry"), import("./hr-time/Performance"), import("./range/AbstractRange"), import("./range/Range"), import("./mutation-observer/MutationObserver"), import("./mutation-observer/MutationRecord"), import("./crypto/Noise"), import("./geometry/DOMPoint"), import("./geometry/DOMPointReadOnly"), import("./geometry/DOMRect"), import("./geometry/DOMRectReadOnly"), import("./geometry/DOMMatrix"), import("./image/ImageData"), import("./xr/XRPose"), import("./xr/XRRigidTransform"), import("./xr/XRSession")]);
  } else {
    modules = Promise.all([await import("./attributes/NamedNodeMap"), await import("./attributes/Attr"), await import("./nodes/Node"), await import("./nodes/NodeList"), await import("./nodes/Element"), await import("./nodes/DocumentFragment"), await import("./nodes/DocumentType"), await import("./nodes/SpatialDocument"), await import("./nodes/Text"), await import("./nodes/HTMLCollection"), await import("./nodes/DOMTokenList"), await import("./nodes/HTMLElement"), await import("./nodes/HTMLContentElement"), await import("./nodes/HTMLHeadElement"), await import("./nodes/HTMLTitleElement"), await import("./nodes/HTMLMetaElement"), await import("./nodes/HTMLStyleElement"), await import("./nodes/HTMLScriptElement"), await import("./nodes/HTMLDivElement"), await import("./nodes/HTMLSpanElement"), await import("./nodes/HTMLImageElement"), await import("./nodes/SpatialElement"), await import("./cssom/StyleSheetList"), await import("./events/CloseEvent"), await import("./events/CustomEvent"), await import("./events/ErrorEvent"), await import("./events/FocusEvent"), await import("./events/HashChangeEvent"), await import("./events/KeyboardEvent"), await import("./events/MessageEvent"), await import("./events/MouseEvent"), await import("./events/PopStateEvent"), await import("./events/ProgressEvent"), await import("./events/TouchEvent"), await import("./events/UIEvent"), await import("./domexception"), await import("./custom-elements/CustomElementRegistry"), await import("./hr-time/Performance"), await import("./range/AbstractRange"), await import("./range/Range"), await import("./mutation-observer/MutationObserver"), await import("./mutation-observer/MutationRecord"), await import("./crypto/Noise"), await import("./geometry/DOMPoint"), await import("./geometry/DOMPointReadOnly"), await import("./geometry/DOMRect"), await import("./geometry/DOMRectReadOnly"), await import("./geometry/DOMMatrix"), await import("./image/ImageData"), await import("./xr/XRPose"), await import("./xr/XRRigidTransform"), await import("./xr/XRSession")]);
  }
  return modules.then(([NamedNodeMapImpl, {
    AttrImpl
  }, {
    NodeImpl
  }, {
    NodeListImpl
  }, {
    ElementImpl
  }, DocumentFragmentImpl, {
    DocumentTypeImpl
  }, {
    SpatialDocumentImpl
  }, {
    TextImpl
  }, HTMLCollectionImpl, DOMTokenListImpl, {
    HTMLElementImpl
  }, {
    HTMLContentElement: HTMLContentElementImpl
  }, HTMLHeadElementImpl, HTMLTitleElementImpl, HTMLMetaElementImpl, HTMLStyleElementImpl, HTMLScriptElementImpl, HTMLDivElementImpl, HTMLSpanElementImpl, HTMLImageElementImpl, {
    SpatialElement
  }, StyleSheetListImpl, {
    CloseEventImpl
  }, {
    CustomEventImpl
  }, ErrorEventImpl, FocusEventImpl, HashChangeEventImpl, KeyboardEventImpl, MessageEventImpl, MouseEventImpl, PopStateEventImpl, ProgressEventImpl, TouchEventImpl, {
    UIEventImpl
  }, DOMExceptionImpl, {
    CustomElementRegistryImpl
  }, {
    PerformanceImpl
  }, {
    AbstractRangeImpl
  }, {
    RangeImpl
  }, {
    MutationObserverImpl
  }, {
    MutationRecordImpl
  }, NoiseImpl, DOMPointImpl, DOMPointReadOnlyImpl, DOMRectImpl, DOMRectReadOnlyImpl, DOMMatrixImpl, ImageDataImpl, XRPoseImpl, XRRigidTransformImpl, XRSessionImpl]) => {
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
    implementedInterfaces.set('DOMMatrix', DOMMatrixImpl.default);
    implementedInterfaces.set('ImageData', ImageDataImpl.default);
    implementedInterfaces.set('XRPose', XRPoseImpl.default);
    implementedInterfaces.set('XRRigidTransform', XRRigidTransformImpl.default);
    implementedInterfaces.set('XRSession', XRSessionImpl.default);
    implementationLoaded = true;
  });
}
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
export function getInterfaceWrapper(name: 'DOMMatrix'): typeof DOMMatrixImpl;
export function getInterfaceWrapper(name: 'ImageData'): typeof ImageDataImpl;
export function getInterfaceWrapper(name: 'XRPose'): typeof XRPoseImpl;
export function getInterfaceWrapper(name: 'XRRigidTransform'): typeof XRRigidTransformImpl;
export function getInterfaceWrapper(name: 'XRSession'): typeof XRSessionImpl;
export function getInterfaceWrapper(name: string): any;
export function getInterfaceWrapper(name) {
  if (!implementationLoaded) {
    throw new Error('DOM Implementation not loaded');
  }
  return implementedInterfaces.get(name);
}