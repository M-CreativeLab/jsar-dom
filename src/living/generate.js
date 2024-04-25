import generate from "@babel/generator";
import template from "@babel/template";
import * as t from "@babel/types";

let defaultTemplate = template.smart;

const moduleSpecifiers = [
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
  './geometry/DOMMatrix',
  './image/ImageData',
  // WebXR
  './xr/XRPose',
  './xr/XRRigidTransform',
  './xr/XRSession'
];

// const buildParallelImports = template.default(`
//   import(%%source%%)
// `);

// const buildSequentialImports = template.default(`
//   await import(%%source%%)
// `);

// const buildModule = template.default(`
//   modules = Promise.all(%%source%%)
// `);

// const buildIfStatement = template.default(`
//   if (%%isParallel%%) {
//     %%parallelImports%%
//   } else {
//     %%sequentialImports%%
//   }
// `, );

const typeNames = [
  "NamedNodeMapImpl",
  "NodeImpl",
  "ElementImpl",
  "HTMLElementImpl",
  "HTMLContentElement",
  "HTMLStyleElementImpl",
  "HTMLScriptElementImpl",
  "HTMLImageElementImpl",
  "SpatialElement",
  "ImageDataImpl",
  "NoiseImpl",
  "DOMPointImpl",
  "DOMPointReadOnlyImpl",
  "DOMRectImpl",
  "DOMRectReadOnlyImpl",
  "DOMMatrixImpl",
  "XRPoseImpl",
  "XRRigidTransformImpl",
  "XRSessionImpl"
];

const filePaths = [
  "./attributes/NamedNodeMap",
  "./nodes/Node",
  "./nodes/Element",
  "./nodes/HTMLElement",
  "./nodes/HTMLContentElement",
  "./nodes/HTMLStyleElement",
  "./nodes/HTMLScriptElement",
  "./nodes/HTMLImageElement",
  "./nodes/SpatialElement",
  "./image/ImageData",
  "./crypto/Noise",
  "./geometry/DOMPoint",
  "./geometry/DOMPointReadOnly",
  "./geometry/DOMRect",
  "./geometry/DOMRectReadOnly",
  "./geometry/DOMMatrix",
  "./xr/XRPose",
  "./xr/XRRigidTransform",
  "./xr/XRSession"
];

const buildStaticImports = defaultTemplate.ast(`
  import type %%typeNames%% from %%filePaths%%;
`, {
  plugins: [
    'typescript'
  ]
});

const staticImports = typeNames.map((typeName, index) => buildStaticImports({
  typeNames: t.identifier(typeName),
  filePaths: t.stringLiteral(filePaths[index])
}));

console.log(generate.default(staticImports).code);

const buildGetInterfaceWrapper = template.default(`
  export function getInterfaceWrapper(name) {
    if (!implementationLoaded) {
      throw new Error('DOM Implementation not loaded');
    }
    return implementedInterfaces.get(name);
  }
`);

const buildLoadImplementations = template.default(`
  export async function loadImplementations(isParallel = true) {
    let modules;
    %%ifStatement%%
    return modules.then(([
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
      DOMMatrixImpl,
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
      implementedInterfaces.set('DOMMatrix', DOMMatrixImpl.default)
      implementedInterfaces.set('ImageData', ImageDataImpl.default);
      implementedInterfaces.set('XRPose', XRPoseImpl.default);
      implementedInterfaces.set('XRRigidTransform', XRRigidTransformImpl.default);
      implementedInterfaces.set('XRSession', XRSessionImpl.default);
      implementationLoaded = true;
    });
  }
`);

const buildIntegration = template.default(`
  %%staticImports%%
  %%loadImplementations%%
  %%getInterfaceWrapper%%
`)

const parallelImports = moduleSpecifiers.map(specifier => buildParallelImports({
  source: t.stringLiteral(specifier)
}));

const sequentialImports = moduleSpecifiers.map(specifier => buildSequentialImports({
  source: t.stringLiteral(specifier)
}));

const parallelModule = buildModule({
  source: t.arrayExpression(parallelImports.map(imp => imp.expression))
});

const sequentialModule = buildModule({
  source: t.arrayExpression(sequentialImports.map(imp => imp.expression))
});

const ifStatement = buildIfStatement({
  isParallel: t.identifier('isParallel'),
  parallelImports: parallelModule,
  sequentialImports: sequentialModule
});

const loadImplementations = buildLoadImplementations({
  ifStatement: ifStatement
});

const getInterfaceWrapper = buildGetInterfaceWrapper();

const integration = buildIntegration({
  staticImports: staticImports,
  loadImplementations: loadImplementations,
  getInterfaceWrapper: getInterfaceWrapper
})

const code = generate.default(integration).code;
console.log(code);

// const getInterfaceWrapperCode = generate.default(getInterfaceWrapper).code;
// console.log(getInterfaceWrapperCode);
