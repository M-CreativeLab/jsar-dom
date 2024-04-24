import generate from "@babel/generator";
import template from "@babel/template";
import * as t from "@babel/types";

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

// const module_path = './xr/XRSession';

const buildImport = template.default(`
  import(%%source%%)
`);

const buildAwaitImport = template.default(`
  await import(%%source%%)
`);
// const ast = buildImport({
//   source: t.stringLiteral(module_path),
// })
// console.log(generate.default(ast).code);

const imports = moduleSpecifiers.map(specifier => buildImport({
  source: t.stringLiteral(specifier)
}));

const awaitImports = moduleSpecifiers.map(specifier => buildAwaitImport({
  source: t.stringLiteral(specifier)
}));

const importsAst = imports;
const awaitImportsAst = awaitImports; 

// const ifStatement = t.ifStatement(
//   t.booleanLiteral(true),
//   t.blockStatement([importsAst]),
//   t.blockStatement([awaitImportsAst])
// );
const buildIfStatement = template.default(`
  if (%%isParallel%%) {
    %%importsAst%%
  } else {
    %%awaitImports%%
  }
`)

const ifStatement = buildIfStatement({
  isParallel: t.identifier("isParallel"),
  importsAst: importsAst,
  awaitImports: awaitImportsAst
})
console.log(generate.default(ifStatement).code);



