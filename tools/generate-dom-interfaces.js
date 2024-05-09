import generate from '@babel/generator';
import template from '@babel/template';
import * as t from '@babel/types';
import fs from 'fs';
import path from 'path';

const defaultTemplate = template.smart({
  plugins: [
    'typescript'
  ],
  syntacticPlaceholders: false
});

/**
 * This file is responsible for generating the `interface.ts` file in the `living` directory.
 * It is used to load all the implementations of the interfaces asynchronously.
 * 
 * In TypeScript, avoiding circular dependencies can be challenging, especially when dealing with 
 * dependencies that need to be resolved in a specific order. This can lead to compromises in the 
 * project directory structure. To address this issue, we use dynamic imports() to load type 
 * instances asynchronously. We also provide a synchronous function, getInterfaceWrapper, to ensure 
 * the smooth functioning of the type system. This approach ensures that the necessary precautions 
 * are taken during both build time and runtime to guarantee the correct invocation of the function 
 * when using related interfaces.
 */

const moduleSpecifiers = [
  // Attributes
  { path: './attributes/NamedNodeMap', type: 'NamedNodeMapImpl', isDefault: true, name: 'NamedNodeMap' },
  { path: './attributes/Attr', type: 'AttrImpl', isDefault: false, name: 'Attr' },
  // Classic Nodes
  { path: './nodes/Node', type: 'NodeImpl', isDefault: false, name: 'Node' },
  { path: './nodes/NodeList', type: 'NodeListImpl', isDefault: false, name: 'NodeList' },
  { path: './nodes/Element', type: 'ElementImpl', isDefault: false, name: 'Element' },
  { path: './nodes/DocumentFragment', type: 'DocumentFragmentImpl', isDefault: true, name: 'DocumentFragment' },
  { path: './nodes/DocumentType', type: 'DocumentTypeImpl', isDefault: false, name: 'DocumentType' },
  { path: './nodes/SpatialDocument', type: 'SpatialDocumentImpl', isDefault: false, name: 'SpatialDocument' },
  { path: './nodes/Text', type: 'TextImpl', isDefault: false, name: 'Text' },
  { path: './nodes/HTMLCollection', type: 'HTMLCollectionImpl', isDefault: true, name: 'HTMLCollection' },
  { path: './nodes/DOMTokenList', type: 'DOMTokenListImpl', isDefault: true, name: 'DOMTokenList' },
  { path: './nodes/HTMLElement', type: 'HTMLElementImpl', isDefault: false, name: 'HTMLElement' },
  { path: './nodes/HTMLContentElement', type: 'HTMLContentElement', isDefault: false, name: 'HTMLContentElement' },
  { path: './nodes/HTMLHeadElement', type: 'HTMLHeadElementImpl', isDefault: true, name: 'HTMLHeadElement' },
  { path: './nodes/HTMLTitleElement', type: 'HTMLTitleElementImpl', isDefault: true, name: 'HTMLTitleElement' },
  { path: './nodes/HTMLMetaElement', type: 'HTMLMetaElementImpl', isDefault: true, name: 'HTMLMetaElement' },
  { path: './nodes/HTMLStyleElement', type: 'HTMLStyleElementImpl', isDefault: true, name: 'HTMLStyleElement' },
  { path: './nodes/HTMLScriptElement', type: 'HTMLScriptElementImpl', isDefault: true, name: 'HTMLScriptElement' },
  { path: './nodes/HTMLDivElement', type: 'HTMLDivElementImpl', isDefault: true, name: 'HTMLDivElement' },
  { path: './nodes/HTMLSpanElement', type: 'HTMLSpanElementImpl', isDefault: true, name: 'HTMLSpanElement' },
  { path: './nodes/HTMLImageElement', type: 'HTMLImageElementImpl', isDefault: true, name: 'HTMLImageElement' },
  // Spatial Nodes
  { path: './nodes/SpatialElement', type: 'SpatialElement', isDefault: false, name: 'SpatialElement' },
  // CSSOM
  { path: './cssom/StyleSheetList', type: 'StyleSheetListImpl', isDefault: true, name: 'StyleSheetList' },
  // Events
  { path: './events/CloseEvent', type: 'CloseEventImpl', isDefault: false, name: 'CloseEvent' },
  { path: './events/CustomEvent', type: 'CustomEventImpl', isDefault: false, name: 'CustomEvent' },
  { path: './events/ErrorEvent', type: 'ErrorEventImpl', isDefault: true, name: 'ErrorEvent' },
  { path: './events/FocusEvent', type: 'FocusEventImpl', isDefault: true, name: 'FocusEvent' },
  { path: './events/HashChangeEvent', type: 'HashChangeEventImpl', isDefault: true, name: 'HashChangeEvent' },
  { path: './events/KeyboardEvent', type: 'KeyboardEventImpl', isDefault: true, name: 'KeyboardEvent' },
  { path: './events/MessageEvent', type: 'MessageEventImpl', isDefault: true, name: 'MessageEvent' },
  { path: './events/MouseEvent', type: 'MouseEventImpl', isDefault: false, name: 'MouseEvent' },
  { path: './events/PopStateEvent', type: 'PopStateEventImpl', isDefault: true, name: 'PopStateEvent' },
  { path: './events/ProgressEvent', type: 'ProgressEventImpl', isDefault: true, name: 'ProgressEvent' },
  { path: './events/TouchEvent', type: 'TouchEventImpl', isDefault: true, name: 'TouchEvent' },
  { path: './events/UIEvent', type: 'UIEventImpl', isDefault: false, name: 'UIEvent' },
  // Others
  { path: './domexception', type: 'DOMExceptionImpl', isDefault: true, name: 'DOMException' },
  { path: './custom-elements/CustomElementRegistry', type: 'CustomElementRegistryImpl', isDefault: false, name: 'CustomElementRegistry' },
  { path: './hr-time/Performance', type: 'PerformanceImpl', isDefault: false, name: 'Performance' },
  { path: './range/AbstractRange', type: 'AbstractRangeImpl', isDefault: false, name: 'AbstractRange' },
  { path: './range/Range', type: 'RangeImpl', isDefault: false, name: 'Range' },
  { path: './mutation-observer/MutationObserver', type: 'MutationObserverImpl', isDefault: false, name: 'MutationObserver' },
  { path: './mutation-observer/MutationRecord', type: 'MutationRecordImpl', isDefault: false, name: 'MutationRecord' },
  { path: './crypto/Noise', type: 'NoiseImpl', isDefault: true, name: 'Noise' },
  { path: './geometry/DOMPoint', type: 'DOMPointImpl', isDefault: true, name: 'DOMPoint' },
  { path: './geometry/DOMPointReadOnly', type: 'DOMPointReadOnlyImpl', isDefault: true, name: 'DOMPointReadOnly' },
  { path: './geometry/DOMRect', type: 'DOMRectImpl', isDefault: true, name: 'DOMRect' },
  { path: './geometry/DOMRectReadOnly', type: 'DOMRectReadOnlyImpl', isDefault: true, name: 'DOMRectReadOnly' },
  { path: './geometry/DOMMatrix', type: 'DOMMatrixImpl', isDefault: true, name: 'DOMMatrix' },
  { path: './image/ImageData', type: 'ImageDataImpl', isDefault: true, name: 'ImageData' },
  // WebXR
  { path: './xr/XRPose', type: 'XRPoseImpl', isDefault: true, name: 'XRPose' },
  { path: './xr/XRRigidTransform', type: 'XRRigidTransformImpl', isDefault: true, name: 'XRRigidTransform' },
  { path: './xr/XRSession', type: 'XRSessionImpl', isDefault: true, name: 'XRSession' }
];

// Build the templates
const buildTypeImports = (arg) => {
  if (arg.IS_DEFAULT) {
    const baseTemplate = defaultTemplate(`
      import type ${arg.TYPE} from '${arg.SPECIFIER}';
    `);
    return baseTemplate({});
  } 
  const baseTemplate = defaultTemplate(`
    import type { ${arg.TYPE} } from '${arg.SPECIFIER}';
  `);
  return baseTemplate({});
};

const buildHeadStatement = defaultTemplate(`
  TYPE_IMPORTS
  let implementationLoaded = false;
  const implementedInterfaces = new Map<string, any>();
`);

/**
 * solve the issue https://github.com/jestjs/jest/issues/11434 
 * by importing modules dynamically either in parallel or sequentially based on the isParallel flag.
 * @param running parallel or not
 */

const buildParallelImports = (arg) => {
  const baseTemplate = defaultTemplate(`
    import('${arg.MODULE}')
  `);
  return baseTemplate({});
}

const buildSequentialImports = (arg) => {
  const baseTemplate = defaultTemplate(`
    await import('${arg.MODULE}')
  `);
  return baseTemplate({});
}

const buildModule = defaultTemplate(`
  modules = Promise.all(SOURCE)
`);

const buildIfStatement = defaultTemplate(`
  if (IS_PARALLEL) {
    PARALLEL_MODULE
  } else {
    SEQUENTIAL_MODULE
  }
`);

const buildImplementedInterfaces = (arg) => {
  if (arg.IS_DEFAULT) {
    const baseTemplate = defaultTemplate(`
      implementedInterfaces.set('${arg.NAME}', ${arg.TYPE}.default);
    `);
    return baseTemplate({});
  } 
  const baseTemplate = defaultTemplate(`
    implementedInterfaces.set('${arg.NAME}', ${arg.TYPE});
  `);
  return baseTemplate({});
}

const buildLoadImplementations = defaultTemplate(`
  export async function loadImplementations(isParallel = true) {
    let modules;
    IF_STATEMENT
    return modules.then(([
      THEN
    ]) => {
      IMPLEMENTED_INTERFACES
      implementationLoaded = true;
    });
  }
`);

const buildExportFunction = (arg) => {
  const baseTemplate = defaultTemplate(`
    export function getInterfaceWrapper(name: '${arg.NAME}'): typeof ${arg.TYPE}; 
  `);
  return baseTemplate({}); 
};

const buildGetInterfaceWrapper = defaultTemplate(`
  EXPORT_FUNCTION
  export function getInterfaceWrapper(name: string): any;
  export function getInterfaceWrapper(name) {
    if (!implementationLoaded) {
      throw new Error('DOM Implementation not loaded');
    }
    return implementedInterfaces.get(name);
  }
`);

const buildIntegration = defaultTemplate(`
  HEAD_STATEMENT
  LOAD_IMPLEMENTATIONS
  GET_INTERFACE_WRAPPER
`);

// Build the code
const typeImports = moduleSpecifiers.map(specifier => buildTypeImports({
  TYPE: specifier.type,
  SPECIFIER: specifier.path,
  IS_DEFAULT: specifier.isDefault
}));

const headStatement = buildHeadStatement({
  TYPE_IMPORTS: typeImports
});

const parallelImports = moduleSpecifiers.map(specifier => buildParallelImports({
  MODULE: specifier.path
}));

const sequentialImports = moduleSpecifiers.map(specifier => buildSequentialImports({
  MODULE: specifier.path
}));

const parallelModule = buildModule({
  SOURCE: t.arrayExpression(parallelImports.map(imp => imp.expression))
});

const sequentialModule = buildModule({
  SOURCE: t.arrayExpression(sequentialImports.map(imp => imp.expression))
});

const ifStatement = buildIfStatement({
  IS_PARALLEL: t.identifier('isParallel'),
  PARALLEL_MODULE: parallelModule,
  SEQUENTIAL_MODULE: sequentialModule
});

// Template cannot handle single-word task,
// so I choose to use string concatenation to solve this problem.
const then = moduleSpecifiers.map(specifier => {
  if (specifier.isDefault) {
    return specifier.type;
  } else {
    return `{ ${specifier.type} }`;
  }
}).join(', ');

const implementedInterfaces = moduleSpecifiers.map(specifier => buildImplementedInterfaces({
  NAME: specifier.name,
  IS_DEFAULT: specifier.isDefault,
  TYPE: specifier.type
}));

const loadImplementations = buildLoadImplementations({
  IF_STATEMENT: ifStatement,
  THEN: then,
  IMPLEMENTED_INTERFACES: implementedInterfaces
});

const exportFunction = moduleSpecifiers.map(specifier => buildExportFunction({  
  NAME: specifier.name,
  TYPE: specifier.type
}));

const getInterfaceWrapper = buildGetInterfaceWrapper({
  EXPORT_FUNCTION: exportFunction
});

const integration = buildIntegration({
  HEAD_STATEMENT: headStatement,
  LOAD_IMPLEMENTATIONS: loadImplementations,
  GET_INTERFACE_WRAPPER: getInterfaceWrapper
});

// Generate the code
const code = generate.default(t.program(integration)).code;
const outputDir = 'src/living/';
const outputPath = path.resolve(outputDir, 'interfaces.ts');
fs.writeFileSync(outputPath, code, 'utf8');
