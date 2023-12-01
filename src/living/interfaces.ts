let implementationLoaded = false;
const implementedInterfaces = new Map<string, any>();

export async function loadImplementations() {
  return Promise.all([
    // Attributes
    import('./attributes/NamedNodeMap'),
    import('./attributes/Attr'),
    // Nodes
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
    import('./nodes/HTMLHeadElement'),
    import('./nodes/HTMLTitleElement'),
    import('./nodes/HTMLMetaElement'),
    import('./nodes/HTMLScriptElement'),
    import('./nodes/HTMLDivElement'),
    import('./nodes/HTMLSpanElement'),
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
    HTMLHeadElementImpl,
    HTMLTitleElementImpl,
    HTMLMetaElementImpl,
    HTMLScriptElementImpl,
    HTMLDivElementImpl,
    HTMLSpanElementImpl,
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
    implementedInterfaces.set('HTMLHeadElement', HTMLHeadElementImpl);
    implementedInterfaces.set('HTMLTitleElement', HTMLTitleElementImpl);
    implementedInterfaces.set('HTMLMetaElement', HTMLMetaElementImpl);
    implementedInterfaces.set('HTMLScriptElement', HTMLScriptElementImpl);
    implementedInterfaces.set('HTMLDivElement', HTMLDivElementImpl);
    implementedInterfaces.set('HTMLSpanElement', HTMLSpanElementImpl);
    implementedInterfaces.set('StyleSheetList', StyleSheetListImpl);
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
    implementedInterfaces.set('DOMRectReadOnly', DOMRectReadOnlyImpl);
    implementedInterfaces.set('DOMRect', DOMRectImpl);
    implementationLoaded = true;
  });
}

export function getInterfaceWrapper(name: string) {
  if (!implementationLoaded) {
    throw new Error('DOM Implementation not loaded');
  }
  return implementedInterfaces.get(name);
}
