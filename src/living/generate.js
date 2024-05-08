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


// Build the templates
const buildTypeImports = (arg) => {
  if (arg.ISDEFUALT) {
    const baseTemplate = defaultTemplate(`
      import type ${arg.TYPE} from '${arg.SPECIFIER}';
    `, {
      plugins: [
        'typescript'
      ],
      syntacticPlaceholders: false
    });
    return baseTemplate({});
  } 
  const baseTemplate = defaultTemplate(`
    import type { ${arg.TYPE} } from '${arg.SPECIFIER}';
  `, {
    plugins: [
      'typescript'
    ],
    syntacticPlaceholders: false
  });
  return baseTemplate({});
};

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

const buildThen = defaultTemplate(`
  TYPE
`, {
  plugins: [
    'typescript'
  ],
  syntacticPlaceholders: false,
});

const buildImplementedInterfaces = defaultTemplate(`
  implementedInterfaces.set(TYPE, TYPE.default);
`, {
  plugins: [
    'typescript'
  ],
  syntacticPlaceholders: false,
});

const buildLoadImplementations = template.default(`
  export async function loadImplementations(isParallel = true) {
    let modules;
    %%ifStatement%%
    return modules.then(([
      %%then%%
    ]) => {
      %%implementedInterfaces%%
      implementationLoaded = true;
    });
  }
`, {
  plugins: [
    'typescript'
  ]
});

const buildExportFunction = (arg) => {
  const baseTemplate = defaultTemplate(`
    export function getInterfaceWrapper(name: ${arg.TYPE}): typeof ${arg.TYPE}; 
  `, {
    plugins: [
      'typescript'
      ],
    syntacticPlaceholders: false,
    }
  )
  return baseTemplate({});
};

const buildGetInterfaceWrapper = template.default(`
  // TODO: help me to fullfill the other interfaces
  %%exportFunction%%
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

// Build the code
const typeImports = moduleSpecifiers.map(specifier => buildTypeImports({
  TYPE: specifier.type,
  SPECIFIER: specifier.path,
  ISDEFUALT: specifier.isDefault
}));

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

const then = moduleSpecifiers.map(specifier => buildThen({
  TYPE: specifier.type
}));

const implementedInterfaces = moduleSpecifiers.map(specifier => buildImplementedInterfaces({
  TYPE: specifier.type
}));

const loadImplementations = buildLoadImplementations({
  ifStatement: ifStatement,
  then: t.arrayPattern(then.map(th => th.expression)),
  implementedInterfaces: t.arrayExpression(implementedInterfaces.map(impl => impl.expression))
});

t.addComment(loadImplementations, 'leading', comments);

const exportFunction = moduleSpecifiers.map(specifier => buildExportFunction({  
  TYPE: specifier.type
}));

const getInterfaceWrapper = buildGetInterfaceWrapper({
  exportFunction: exportFunction
});

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
