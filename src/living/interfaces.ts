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
    DocumentTypeImpl,
    SpatialDocumentImpl,
    TextImpl,
    HTMLCollectionImpl,
    DOMTokenListImpl,
    HTMLElementImpl,
    HTMLHeadElementImpl,
    HTMLTitleElementImpl,
    HTMLMetaElementImpl,
    HTMLScriptElementImpl,
    HTMLDivElementImpl,
    HTMLSpanElementImpl,
    // CSSOM
    StyleSheetListImpl,
    // Events
    CloseEventImpl,
    CustomEventImpl,
    ErrorEventImpl,
    FocusEventImpl,
    HashChangeEventImpl,
    KeyboardEventImpl,
    MessageEventImpl,
    MouseEventImpl,
    PopStateEventImpl,
    ProgressEventImpl,
    TouchEventImpl,
    UIEventImpl,
    // Others
    DOMException,
    CustomElementRegistryImpl,
    PerformanceImpl,
    AbstractRangeImpl,
    RangeImpl,
    MutationObserverImpl,
    MutationRecordImpl,
    DOMRectReadOnlyImpl,
    DOMRectImpl,
  ]) => {
    implementedInterfaces.set('NamedNodeMap', NamedNodeMapImpl.default);
    implementedInterfaces.set('Attr', AttrImpl);
    implementedInterfaces.set('Node', NodeImpl);
    implementedInterfaces.set('NodeList', NodeListImpl);
    implementedInterfaces.set('Element', ElementImpl);
    implementationLoaded = true;
  });
}

export function getInterfaceWrapper(name: string) {
  if (!implementationLoaded) {
    throw new Error('DOM Implementation not loaded');
  }
  return implementedInterfaces.get(name);
}
