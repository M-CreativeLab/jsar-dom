import type NamedNodeMapImpl from './attributes/NamedNodeMap';
import type { NodeImpl } from './nodes/Node';
import type { ElementImpl } from './nodes/Element';
import type { HTMLElementImpl } from './nodes/HTMLElement';
import type { HTMLContentElement } from './nodes/HTMLContentElement';
import type HTMLStyleElementImpl from './nodes/HTMLStyleElement';
import type HTMLScriptElementImpl from './nodes/HTMLScriptElement';
import type { SpatialElement } from './nodes/SpatialElement';
import type ImageDataImpl from './image/ImageData';

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
export async function loadImplementations() {
  return Promise.all([
    // Attributes
    import('./attributes/NamedNodeMap'),
    import('./attributes/Attr'),
    // Classic Nodes
    import('./nodes/Node'),
    import('./nodes/NodeList'),
    import('./nodes/Element'),
    import('./nodes/DocumentFragment'),
    import('./nodes/DocumentType'),
    import('./nodes/SpatialDocument'),
    import('./nodes/Text'),
    import('./nodes/HTMLCollection'),
    import('./nodes/DOMTokenList'),
    import('./nodes/HTMLElement'),
    import('./nodes/HTMLContentElement'),
    import('./nodes/HTMLHeadElement'),
    import('./nodes/HTMLTitleElement'),
    import('./nodes/HTMLMetaElement'),
    import('./nodes/HTMLStyleElement'),
    import('./nodes/HTMLScriptElement'),
    import('./nodes/HTMLDivElement'),
    import('./nodes/HTMLSpanElement'),
    // Spatial Nodes
    import('./nodes/SpatialElement'),
    // CSSOM
    import('./cssom/StyleSheetList'),
    // Events
    import('./events/CloseEvent'),
    import('./events/CustomEvent'),
    import('./events/ErrorEvent'),
    import('./events/FocusEvent'),
    import('./events/HashChangeEvent'),
    import('./events/KeyboardEvent'),
    import('./events/MessageEvent'),
    import('./events/MouseEvent'),
    import('./events/PopStateEvent'),
    import('./events/ProgressEvent'),
    import('./events/TouchEvent'),
    import('./events/UIEvent'),
    // Others
    import('./domexception'),
    import('./custom-elements/CustomElementRegistry'),
    import('./hr-time/Performance'),
    import('./range/AbstractRange'),
    import('./range/Range'),
    import('./mutation-observer/MutationObserver'),
    import('./mutation-observer/MutationRecord'),
    import('./geometry/DOMRectReadOnly'),
    import('./geometry/DOMRect'),
    import('./image/ImageData'),
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
    DOMException,
    { CustomElementRegistryImpl },
    { PerformanceImpl },
    { AbstractRangeImpl },
    { RangeImpl },
    { MutationObserverImpl },
    { MutationRecordImpl },
    DOMRectReadOnlyImpl,
    DOMRectImpl,
    ImageDataImpl,
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
    implementedInterfaces.set('DOMException', DOMException);
    implementedInterfaces.set('CustomElementRegistry', CustomElementRegistryImpl);
    implementedInterfaces.set('Performance', PerformanceImpl);
    implementedInterfaces.set('AbstractRange', AbstractRangeImpl);
    implementedInterfaces.set('Range', RangeImpl);
    implementedInterfaces.set('MutationObserver', MutationObserverImpl);
    implementedInterfaces.set('MutationRecord', MutationRecordImpl);
    implementedInterfaces.set('DOMRectReadOnly', DOMRectReadOnlyImpl.default);
    implementedInterfaces.set('DOMRect', DOMRectImpl.default);
    implementedInterfaces.set('ImageData', ImageDataImpl.default);
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
export function getInterfaceWrapper(name: 'SpatialElement'): typeof SpatialElement;
export function getInterfaceWrapper(name: 'ImageData'): typeof ImageDataImpl
export function getInterfaceWrapper(name: string): any;
export function getInterfaceWrapper(name: string) {
  if (!implementationLoaded) {
    throw new Error('DOM Implementation not loaded');
  }
  return implementedInterfaces.get(name);
}
