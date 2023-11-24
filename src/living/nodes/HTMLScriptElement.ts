import vm from 'vm';
import * as BABYLON from 'babylonjs';
import * as babel from '@babel/core';
import typescriptTransformPlugin from '@babel/plugin-transform-typescript';
import commonjsTransformPlugin from '@babel/plugin-transform-modules-commonjs';
import DOMException from 'domexception';

import { NativeDocument } from '../../impl-interfaces';
import { HTMLElementImpl } from './HTMLElement';

const scriptMIMETypes = new Set([
  'application/javascript',
  'application/typescript',
  'text/javascript',
  'text/typescript',
]);
const supportedScriptExtensions = ['.ts', '.mjs', '.js'];
const supportedJsonExtensions = ['.json'];  // supports json5?
const supportedBinaryExtensions = [
  '.bin',                             // common binary
  '.wasm',                            // wasm binary
  '.png', '.jpg', '.jpeg', '.webp',   // image formats
  '.mp3', '.wav', '.ogg'              // media formats
];

/**
 * The type `CompiledScriptResult` represents the result after compiling a TypeScript/JavaScript script.
 */
type CompiledScriptResult = {
  /**
   * The compiled code.
   */
  code: string;
  /**
   * The dependencies of the compiled code.
   */
  esmImports: string[];
};

class CompiledModule {
  type: 'json' | 'wasm' | 'script' | 'binary' | 'unknown' = 'unknown';
  result: CompiledScriptResult | ArrayBuffer | object;

  constructor(result: CompiledModule['result'], isScript = false) {
    this.result = result;
    if (isScript) {
      this.type = 'script';
    } else if (result instanceof ArrayBuffer) {
      this.type = 'binary';
    } else if (typeof result === 'object') {
      this.type = 'json';
    } else {
      this.type = 'unknown';
    }
  }
}

function importsRecordPlugin(_, { esmImports }) {
  const checkAndAddImportSource = (path) => {
    console.log('import source', path.node);
    if (path.node?.source?.extra?.rawValue) {
      esmImports.push(path.node.source.extra.rawValue);
    }
  };
  return {
    visitor: {
      /**
       * Supports:
       * 
       * ```ts
       * import 'foo';
       * import * as foo from 'foo';
       * import foo from 'foo';
       * import { foo } from 'foo';
       * ```
       */
      ImportDeclaration: checkAndAddImportSource,
      /**
       * Supports:
       * 
       * ```ts
       * export { foo } from 'foo';
       * ```
       */
      ExportNamedDeclaration: checkAndAddImportSource,
      /**
       * Supports:
       * 
       * ```ts
       * export * from 'foo';
       * ```
       */
      ExportAllDeclaration: checkAndAddImportSource,
    },
  };
}

function dynamicImportsReplacerPlugin() {
  const { types } = babel;
  const IMPORT = 'Import';
  // const AWAIT = 'AwaitExpression';
  const CALL = 'CallExpression';
  const buildImport = babel.template(`__dynamicImport__(%%sourcePath%%)`);
  const generateSourceNode = node => {
    const astNode = node[0];
    let path = types.templateLiteral(
      [
        types.templateElement({ raw: '' }),
        types.templateElement({ raw: '' }, true)
      ],
      node,
    );
    if (types.isStringLiteral(astNode) || types.isTemplateLiteral(astNode)) {
      path = node;
    }
    return path;
  };

  return {
    visitor: {
      Program: {
        enter(path) {
          path.traverse({
            [CALL]: path => {
              if (path.node.callee.type === IMPORT) {
                const sourcePath = generateSourceNode(path.node.arguments);
                path.replaceWith(buildImport({ sourcePath }));
              }
            },
          });
        }
      }
    }
  };
}

export default class HTMLScriptElementImpl extends HTMLElementImpl implements HTMLScriptElement {
  async: boolean;
  charset: string;
  crossOrigin: string;
  defer: boolean;
  event: string;
  htmlFor: string;
  integrity: string;
  noModule: boolean;
  referrerPolicy: string;
  src: string;
  text: string;
  type: string;

  private _code: string = '';

  constructor(
    nativeDocument: NativeDocument,
    args,
    _privateData: {} = null
  ) {
    super(nativeDocument, args, {
      localName: 'script',
    });
  }

  _attach(): void {
    super._attach();
    this._eval();
  }

  _attrModified(name, value, oldValue) {
    super._attrModified(name, value, oldValue);
    console.log('fetching external script', name, value);
  }

  private async _compile(source: string): Promise<CompiledScriptResult> {
    return await this._ownerDocument._executeWithTimeProfiler('code compilition', async () => {
      /** Used to storage esm dependencies */
      const esmImports: string[] = [];
      let code: string = '';

      /**
       * FIXME(Yorkie): because the on-the-air code is to be designed to be small, now we use babel to transform the code.
       * If there is a performance problem, we can consider using the `swc` rust library instead.
       */
      const result = await babel.transformAsync(source, {
        sourceType: 'module',
        targets: {
          node: 'current',
        },
        cwd: this.ownerDocument.baseURI,
        caller: {
          name: 'JSARDOM',
          supportsStaticESM: true,
          supportsDynamicImport: false,
          supportsTopLevelAwait: false,
          supportsExportNamespaceFrom: false,
        },
        plugins: [
          // 1. Transform TypeScript into modern JavaScript.
          [typescriptTransformPlugin, {
            // FIXME: this is a hack to make this babel plugin work.
          }],
          // 2. Collect the import declarations and save them as dependencies.
          [importsRecordPlugin, {
            esmImports,
          }],
          // 3. Transform the code into CommonJS.
          [commonjsTransformPlugin, {
            importInterop: 'node',
          }],
          // 4. Transform the dyanmic import() into a function call to __dynamicImport__().
          [dynamicImportsReplacerPlugin],
        ],
      });

      if (result.code) {
        code = result.code;
      }
      return { code, esmImports };
    });
  }

  private async _eval() {
    try {
      const src = this.getAttribute('src');
      if (!this.textContent && src) {
        // fetch the script
      }
      if (this.textContent && src) {
        throw new DOMException('The script element must not have both a src attribute and a script content.', 'SyntaxError');
      }

      const { code, esmImports } = await this._compile(this.textContent);
      this._evalInternal(code);
    } catch (err) {
      throw new DOMException(err.message, 'SyntaxError');
    }
  }

  private _evalInternal(code: string) {
    const cjsModule = { exports: {} };
    const context = Object.assign(this._ownerDocument._defaultView, {
      // Babylon.js
      BABYLON,
      // Node.js
      Buffer,
      // cjs
      module: cjsModule,
      exports: cjsModule.exports,
    });

    if (vm && typeof vm.runInNewContext === 'function') {
      vm.runInNewContext(code, context, {
        importModuleDynamically: (_specifier) => {
          // Because we have removed the dynamic import()s in code compilation, this is impossible to be called here.
          // TODO: implement the dynamic import() here?
          throw new DOMException('Fatel error to compile the script.', 'SyntaxError');
        },
      });
    } else {
      /**
       * This is used when the platform deesn't support `vm.runInNewContext()` such as browsers or deno.
       */
      const ids = Object.keys(context);
      const args = Object.values(context);
      const fn = new Function(...ids, code);
      // FIXME: null to this?
      fn.apply(null, args);
    }
  }
}
