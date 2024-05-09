import generate from '@babel/generator';
import template from '@babel/template';
import * as t from '@babel/types';
import fs from 'fs';
import path from 'path';

let defaultTemplate = template.smart({
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
  { path: './nodes/HTMLCollection', type: 'HTMLCollectionImpl', isDefault: true },
  { path: './nodes/DOMTokenList', type: 'DOMTokenListImpl', isDefault: true },
  { path: './nodes/HTMLElement', type: 'HTMLElementImpl', isDefault: false },
  { path: './nodes/HTMLContentElement', type: 'HTMLContentElement', isDefault: false },
  { path: './nodes/HTMLHeadElement', type: 'HTMLHeadElementImpl', isDefault: true },
  { path: './nodes/HTMLTitleElement', type: 'HTMLTitleElementImpl', isDefault: true },
  { path: './nodes/HTMLMetaElement', type: 'HTMLMetaElementImpl', isDefault: true },
  { path: './nodes/HTMLStyleElement', type: 'HTMLStyleElementImpl', isDefault: true },
  { path: './nodes/HTMLScriptElement', type: 'HTMLScriptElementImpl', isDefault: true },
  { path: './nodes/HTMLDivElement', type: 'HTMLDivElementImpl', isDefault: true },
  { path: './nodes/HTMLSpanElement', type: 'HTMLSpanElementImpl', isDefault: true },
  { path: './nodes/HTMLImageElement', type: 'HTMLImageElementImpl', isDefault: true },
  // Spatial Nodes
  { path: './nodes/SpatialElement', type: 'SpatialElement', isDefault: false },
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
  { path: './domexception', type: 'DOMExceptionImpl', isDefault: true },
  { path: './custom-elements/CustomElementRegistry', type: 'CustomElementRegistryImpl', isDefault: false },
  { path: './hr-time/Performance', type: 'PerformanceImpl', isDefault: false },
  { path: './range/AbstractRange', type: 'AbstractRangeImpl', isDefault: false },
  { path: './range/Range', type: 'RangeImpl', isDefault: false },
  { path: './mutation-observer/MutationObserver', type: 'MutationObserverImpl', isDefault: false },
  { path: './mutation-observer/MutationRecord', type: 'MutationRecordImpl', isDefault: false },
  { path: './crypto/Noise', type: 'NoiseImpl', isDefault: true },
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

// Build the templates
const buildTypeImports = (arg) => {
  if (arg.ISDEFAULT) {
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
  TYPEIMPORTS

  let implementationLoaded = false;
  const implementedInterfaces = new Map<string, any>();
`);

/**
 * solve the issue https://github.com/jestjs/jest/issues/11434 
 * by importing modules dynamically either in parallel or sequentially based on the isParallel flag.
 * @param running parallel or not
 */

const buildParallelImports = defaultTemplate(`
  import(MODULE)
`);

const buildSequentialImports = defaultTemplate(`
  await import(MODULE)
`);

const buildModule = defaultTemplate(`
  modules = Promise.all(SOURCE)
`);

const buildIfStatement = defaultTemplate(`
  if (ISPARALLEL) {
    PARALLELMODULE
  } else {
    SEQUENTIALMODULE
  }
`);

const buildThen = defaultTemplate(`
  TYPE
`);

const buildImplementedInterfaces = defaultTemplate(`
  implementedInterfaces.set(TYPE, TYPE.default);
`);

const buildLoadImplementations = defaultTemplate(`
  export async function loadImplementations(isParallel = true) {
    let modules;
    IFSTATEMENT
    return modules.then(([
      THEN
    ]) => {
      IMPLEMENTEDINTERFACES
      implementationLoaded = true;
    });
  }
`);

const buildExportFunction = (arg) => {
  const baseTemplate = defaultTemplate(`
    export function getInterfaceWrapper(name: '${arg.TYPE}'): typeof ${arg.TYPE}; 
  `);
  return baseTemplate({}); 
};

const buildGetInterfaceWrapper = defaultTemplate(`
  EXPORTFUNCTION
  export function getInterfaceWrapper(name: string): any;
  export function getInterfaceWrapper(name) {
    if (!implementationLoaded) {
      throw new Error('DOM Implementation not loaded');
    }
    return implementedInterfaces.get(name);
  }
`);

const buildIntegration = defaultTemplate(`
  HEADSTATEMENT
  LOADIMPLEMENTATIONS
  GETINTERFACEWRAPPER
`);

// Build the code
const typeImports = moduleSpecifiers.map(specifier => buildTypeImports({
  TYPE: specifier.type,
  SPECIFIER: specifier.path,
  ISDEFAULT: specifier.isDefault
}));

const headStatement = buildHeadStatement({
  TYPEIMPORTS: typeImports
});

const parallelImports = moduleSpecifiers.map(specifier => buildParallelImports({
  MODULE: t.stringLiteral(specifier.path)
}));

const sequentialImports = moduleSpecifiers.map(specifier => buildSequentialImports({
  MODULE: t.stringLiteral(specifier.path)
}));

const parallelModule = buildModule({
  SOURCE: t.arrayExpression(parallelImports.map(imp => imp.expression))
});

const sequentialModule = buildModule({
  SOURCE: t.arrayExpression(sequentialImports.map(imp => imp.expression))
});

const ifStatement = buildIfStatement({
  ISPARALLEL: t.identifier('isParallel'),
  PARALLELMODULE: parallelModule,
  SEQUENTIALMODULE: sequentialModule
});

const then = moduleSpecifiers.map(specifier => buildThen({
  TYPE: specifier.type
}));

const implementedInterfaces = moduleSpecifiers.map(specifier => buildImplementedInterfaces({
  TYPE: specifier.type
}));

const loadImplementations = buildLoadImplementations({
  IFSTATEMENT: ifStatement,
  THEN: t.arrayPattern(then.map(th => th.expression)),
  IMPLEMENTEDINTERFACES: implementedInterfaces
});

const exportFunction = moduleSpecifiers.map(specifier => buildExportFunction({  
  TYPE: specifier.type
}));

const getInterfaceWrapper = buildGetInterfaceWrapper({
  EXPORTFUNCTION: exportFunction
});

const integration = buildIntegration({
  HEADSTATEMENT: headStatement,
  LOADIMPLEMENTATIONS: loadImplementations,
  GETINTERFACEWRAPPER: getInterfaceWrapper
});

// Generate the code
const code = generate.default(t.program(integration)).code;
const __dirname = 'src/living/';
const outputPath = path.resolve(__dirname, 'interfaces.ts');
fs.writeFileSync(outputPath, code, 'utf8');
