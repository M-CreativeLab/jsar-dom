import generate from '@babel/generator';
import template from '@babel/template';
import * as t from '@babel/types';
import { parse } from '@babel/parser';
import fs from 'fs';
import path from 'path';

let defaultTemplate = template.smart;

const moduleSpecifiers = [
  // Attributes
  { path: './attributes/NamedNodeMap', type: 'NamedNodeMapImpl', isDefault: true },
  { path: './attributes/Attr', type: 'AttrImpl', isDefault: false },
  // Classic Nodes
  { path: './nodes/Node', type: 'NodeImpl', isDefault: false },
  { path: './nodes/NodeList', type: 'NodeListImpl', isDefault: false },
  { path: './nodes/Element', type: 'ElementImpl', isDefault: false },
  { path: './nodes/DocumentFragment', type: 'DocumentFragmentImpl', isDefault: true },
  { path: './nodes/DocumentType', type: 'DocumentTypeImpl', isDefault: false },
  { path: './nodes/SpatialDocument', type: 'SpatialDocumentImpl', isDefault: false },
  { path: './nodes/Text', type: 'TextImpl', isDefault: false },
  { path: './nodes/HTMLCollection', type: 'HTMLCollectionImpl', isDefault: false },
  { path: './nodes/DOMTokenList', type: 'DOMTokenListImpl', isDefault: false },
  { path: './nodes/HTMLElement', type: 'HTMLElementImpl', isDefault: false },
  { path: './nodes/HTMLContentElement', type: 'HTMLContentElementImpl', isDefault: false },
  { path: './nodes/HTMLHeadElement', type: 'HTMLHeadElementImpl', isDefault: true },
  { path: './nodes/HTMLTitleElement', type: 'HTMLTitleElementImpl', isDefault: true },
  { path: './nodes/HTMLMetaElement', type: 'HTMLMetaElementImpl', isDefault: true },
  { path: './nodes/HTMLStyleElement', type: 'HTMLStyleElementImpl', isDefault: true },
  { path: './nodes/HTMLScriptElement', type: 'HTMLScriptElementImpl', isDefault: true },
  { path: './nodes/HTMLDivElement', type: 'HTMLDivElementImpl', isDefault: true },
  { path: './nodes/HTMLSpanElement', type: 'HTMLSpanElementImpl', isDefault: true },
  { path: './nodes/HTMLImageElement', type: 'HTMLImageElementImpl', isDefault: true },
  // Spatial Nodes
  { path: './nodes/SpatialElement', type: 'SpatialElementImpl', isDefault: false },
  // CSSOM
  { path: './cssom/StyleSheetList', type: 'StyleSheetListImpl', isDefault: true },
  // Events
  { path: './events/CloseEvent', type: 'CloseEventImpl', isDefault: false },
  { path: './events/CustomEvent', type: 'CustomEventImpl', isDefault: false },
  { path: './events/ErrorEvent', type: 'ErrorEventImpl', isDefault: true },
  { path: './events/FocusEvent', type: 'FocusEventImpl', isDefault: true },
  { path: './events/HashChangeEvent', type: 'HashChangeEventImpl', isDefault: true },
  { path: './events/KeyboardEvent', type: 'KeyboardEventImpl', isDefault: true },
  { path: './events/MessageEvent', type: 'MessageEventImpl', isDefault: true },
  { path: './events/MouseEvent', type: 'MouseEventImpl', isDefault: false },
  { path: './events/PopStateEvent', type: 'PopStateEventImpl', isDefault: true },
  { path: './events/ProgressEvent', type: 'ProgressEventImpl', isDefault: true },
  { path: './events/TouchEvent', type: 'TouchEventImpl', isDefault: true },
  { path: './events/UIEvent', type: 'UIEventImpl', isDefault: false },
  // Others
  { path: './domexception', type: 'DOMExceptionImpl', isDefault: false },
  { path: './custom-elements/CustomElementRegistry', type: 'CustomElementRegistryImpl', isDefault: false },
  { path: './hr-time/Performance', type: 'PerformanceImpl', isDefault: false },
  { path: './range/AbstractRange', type: 'AbstractRangeImpl', isDefault: false },
  { path: './range/Range', type: 'RangeImpl', isDefault: false },
  { path: './mutation-observer/MutationObserver', type: 'MutationObserverImpl', isDefault: false },
  { path: './mutation-observer/MutationRecord', type: 'MutationRecordImpl', isDefault: false },
  { path: './crypto/Noise', type: 'NoiseImpl', isDefault: false },
  { path: './geometry/DOMPoint', type: 'DOMPointImpl', isDefault: true },
  { path: './geometry/DOMPointReadOnly', type: 'DOMPointReadOnlyImpl', isDefault: true },
  { path: './geometry/DOMRect', type: 'DOMRectImpl', isDefault: true },
  { path: './geometry/DOMRectReadOnly', type: 'DOMRectReadOnlyImpl', isDefault: true },
  { path: './geometry/DOMMatrix', type: 'DOMMatrixImpl', isDefault: true },
  { path: './image/ImageData', type: 'ImageDataImpl', isDefault: true },
  // WebXR
  { path: './xr/XRPose', type: 'XRPoseImpl', isDefault: true },
  { path: './xr/XRRigidTransform', type: 'XRRigidTransformImpl', isDefault: true },
  { path: './xr/XRSession', type: 'XRSessionImpl', isDefault: true }
];

const buildTypeImports = (arg) => {
  const baseTemplate = defaultTemplate(`
    import type ${arg.TYPE} from '${arg.SPECIFIER}';
  `, {
    plugins: [
      'typescript'
    ],
    syntacticPlaceholders: false
  });
  return baseTemplate({});
};

// Build the templates
const buildHeadStatement = defaultTemplate(`
  %%typeImports%%

  let implementationLoaded = false;
  const implementedInterfaces = new Map<string, any>();
`, {
  plugins: [
    'typescript'
  ]
});

const comments = `
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
  * by importing modules dynamically either in parallel or 
  * sequentially based on the isParallel flag. 
  * @param running parallel or not 
`;

const buildParallelImports = template.default(`
  import(%%module%%)\n
`);

const buildSequentialImports = template.default(`
  await import(%%module%%)\n
`);

const buildModule = template.default(`
  modules = Promise.all(%%source%%)
`);

const buildIfStatement = template.default(`
  if (%%isParallel%%) {
    %%parallelImports%%
  } else {
    %%sequentialImports%%
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
`, {
  plugins: [
    'typescript'
  ]
});

const buildGetInterfaceWrapper = template.default(`
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
`, {
  plugins: [
    'typescript'
  ]
});

const buildIntegration = template.default(`
  %%headStatement%%
  %%loadImplementations%%
  %%getInterfaceWrapper%%
`);

// const types = moduleSpecifiers.map(specifier => `import type ${specifier.type} from ${specifier.path};`).join('\n');
// const ast = parse(types);

// const output = generate.default(
//   ast,
//   {
//     /* options */
//   },
//   types
// );
// console.log(output.code);

// Build the code
const typeImports = moduleSpecifiers.map(specifier => buildTypeImports({
  TYPE: specifier.type,
  SPECIFIER: specifier.path,
}));

// const typeImports = moduleSpecifiers.map(spcecifier => t.tsImportType(
//   argument = t.identifier(spcecifier.type),
//   qualifier = t.stringLiteral(spcecifier.path),
// ));

const headStatement = buildHeadStatement({
  typeImports: typeImports
});

const parallelImports = moduleSpecifiers.map(specifier => buildParallelImports({
  module: t.stringLiteral(specifier.path)
}));

const sequentialImports = moduleSpecifiers.map(specifier => buildSequentialImports({
  module: t.stringLiteral(specifier.path)
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

t.addComment(loadImplementations, 'leading', comments);

const getInterfaceWrapper = buildGetInterfaceWrapper();

const integration = buildIntegration({
  headStatement: headStatement,
  loadImplementations: loadImplementations,
  getInterfaceWrapper: getInterfaceWrapper
})

// Generate the code
const code = generate.default(t.program(integration)).code;
const __dirname = "/Users/faych/workspace/jsar-dom/src/living/"
const outputPath = path.resolve(__dirname, 'interface.ts');
fs.writeFileSync(outputPath, code, 'utf8')
