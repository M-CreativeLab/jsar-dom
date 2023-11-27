import path from 'path';
import vm from 'vm';
import * as BABYLON from 'babylonjs';
import * as babel from '@babel/core';
import typescriptTransformPlugin from '@babel/plugin-transform-typescript';
import commonjsTransformPlugin from '@babel/plugin-transform-modules-commonjs';
import DOMException from 'domexception';

import { NativeDocument, ResourceLoader } from '../../impl-interfaces';
import { HTMLElementImpl } from './HTMLElement';
import { join as joinUrl } from '../helpers/url';
import { reportException } from '../helpers/runtime-script-errors';

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

type ScriptFetchingOptions<T> = {
  readLocalData: (url: string) => Promise<T>;
  readResponseData: (res: Response) => Promise<T>;
};

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
  /**
   * The type of the module.
   * Possible values are: 'json', 'wasm', 'script', 'binary', 'unknown'.
   */
  type: 'json' | 'wasm' | 'script' | 'binary' | 'unknown' = 'unknown';
  /**
   * The result of a compiled module.
   * It can be of type `CompiledScriptResult`, `ArrayBuffer`, or `object`.
   */
  result: object | ArrayBuffer | CompiledScriptResult;

  /**
   * Constructs a new HTMLScriptElement.
   * 
   * @param result - The result of the compiled module.
   * @param isScript - Indicates whether the element is a script.
   */
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

/**
 * A Babel plugin that records import sources from import and export declarations.
 * 
 * @param _ - Placeholder parameter, not used in the function.
 * @param esmImports - An array to store the import sources.
 * @returns A Babel visitor object with handlers for import and export declarations.
 */
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

/**
 * A Babel plugin that replaces dynamic import statements with a custom import function.
 * This plugin is used to transform dynamic import statements in JavaScript code.
 *
 * @returns {object} - The Babel plugin object.
 */
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

/**
 * Represents an implementation of the HTMLScriptElement interface.
 */
export default class HTMLScriptElementImpl extends HTMLElementImpl implements HTMLScriptElement {
  /**
   * Indicates whether the script should be executed asynchronously.
   */
  async: boolean;
  /**
   * The character encoding of the external script file.
   */
  charset: string;
  /**
   * The CORS (Cross-Origin Resource Sharing) setting for the script element.
   */
  crossOrigin: string;
  /**
   * Indicates whether the script should be executed after the page has finished parsing.
   */
  defer: boolean;
  /**
   * The event associated with the HTMLScriptElement.
   */
  event: string;
  /**
   * The value of the `htmlFor` attribute of an HTML `<script>` element.
   */
  htmlFor: string;
  /**
   * The integrity attribute of the HTMLScriptElement.
   * It represents a cryptographic hash of the script resource being applied.
   */
  integrity: string;
  /**
   * Indicates whether the script should be treated as a module or not.
   */
  noModule: boolean;
  /**
   * The referrer policy for the HTMLScriptElement.
   */
  referrerPolicy: string;
  /**
   * The source URL of the script.
   */
  src: string;
  /**
   * The text content of the HTMLScriptElement.
   */
  text: string;
  /**
   * The type of the script.
   */
  type: string;

  private _basePath: string;
  private _code: string = '';
  private _compiledEntryCode: string;
  private _compiledModules: Map<string, CompiledModule> = new Map();
  private _loaded: boolean = false;

  constructor(
    nativeDocument: NativeDocument,
    args,
    _privateData: {} = null
  ) {
    super(nativeDocument, args, {
      localName: 'script',
    });
    this._basePath = this.ownerDocument.baseURI;
  }

  _attach(): void {
    super._attach();
    this._eval();
  }

  _attrModified(name, value, oldValue) {
    super._attrModified(name, value, oldValue);
  }

  private get console(): Console {
    return this._hostObject.console;
  }

  private get resourceLoader(): ResourceLoader {
    return this._hostObject.userAgent.resourceLoader;
  }

  private async _addCompiledModule(uri: string) {
    const resourceExt = path.extname(uri);

    try {
      // handle JSON
      if (supportedJsonExtensions.includes(resourceExt)) {
        const json = await this.resourceLoader.fetch(uri, {}, 'json');
        this._compiledModules.set(uri, new CompiledModule(json));
        return;
      }
      // handle binary
      if (supportedBinaryExtensions.includes(resourceExt)) {
        const arraybuffer = await this.resourceLoader.fetch(uri, {}, 'arraybuffer');
        this._compiledModules.set(uri, new CompiledModule(arraybuffer));
        return;
      }
    } catch (err) {
      this.console.warn(`failed to fetch the module(${uri}) because of ${err}.`);
    }

    // handle script (ts, mjs, js or no extension)
    if (resourceExt === '' || supportedScriptExtensions.includes(resourceExt)) {
      const scriptSource = await this._tryFetchScriptWithExtensions(uri, supportedScriptExtensions);
      const result = await this._compile(scriptSource);
      this._compiledModules.set(uri, new CompiledModule(result, true));

      // recursively add the dependencies.
      // NOTE: only script has dependencies.
      await this._addModuleRecursively(result.esmImports, path.dirname(uri));
    }
  }

  /**
   * Recursively adds modules to the script element.
   * @param esmImports - The array of ES module imports.
   * @param basePath - The base path for resolving relative import paths.
   * @throws {TypeError} If the import path is not a relative path.
   */
  private async _addModuleRecursively(esmImports: string[], basePath: string = this._basePath) {
    for (let importPath of esmImports) {
      const isRelative = importPath.startsWith('./') || importPath.startsWith('../');
      if (isRelative) {
        await this._addCompiledModule(joinUrl(importPath, basePath));
      } else {
        throw new TypeError(`The import path must be relative path.`);
      }
    }
  }

  /**
   * This method tries to fetch the given script with the given extensions in order.
   *
   * @param uri The uri of the script.
   * @param extensions The extensions to try such as ['.ts', '.mjs', '.js'].
   * @returns The script source in utf8 encoding.
   */
  async _tryFetchScriptWithExtensions(uri: string, extensions: string[]): Promise<string> {
    const triedUris: string[] = [uri];
    for (let ext of extensions) {
      triedUris.push(uri + ext);
      try {
        const scriptSource = await this.resourceLoader.fetch(uri + ext, {}, 'string');
        return scriptSource;
      } catch (_err) {
        this.console.warn(`failed to fetch the script because of ${_err}, try next.`);
      }
    }
    try {
      return await this.resourceLoader.fetch(uri, {}, 'string');
    } catch (_err) {
      const details = triedUris.map(s => `  ${s}`).join('\n');
      throw new TypeError(`Failed to fetch the script source: ${uri}, tried uris:\n${details}`);
    }
  }

  /**
   * Compiles the given source code into a JavaScript code.
   * @param source The source code to compile.
   * @returns A promise that resolves to the compiled script result, which includes the compiled code and any ES module imports.
   */
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

  private async _load(): Promise<boolean> {
    if (this._loaded) {
      return true;
    }

    /**
     * 1. Fetch or use the script content.
     */
    const src = this.getAttribute('src');
    if (src && this.textContent) {
      throw new DOMException('The script element must not have both a src attribute and a script content.', 'SyntaxError');
    }
    if (!this.textContent && src) {
      this._basePath = path.dirname(src);
      this._code = await this._hostObject.userAgent.resourceLoader.fetch(src, {}, 'string');
    } else {
      this._code = this.textContent;
    }

    /**
     * 2. Compile the code.
     */
    const { code, esmImports } = await this._compile(this._code);

    /**
     * 3. Load and compile the dependencies.
     */
    await this._addModuleRecursively(esmImports, this._basePath);

    /**
     * 4. Save the compiled script source
     */
    this._compiledEntryCode = code;
    this._loaded = true;
    return true;
  }

  /**
   * Asynchronously evaluates the script content or fetches and evaluates the script from the src attribute.
   * @private
   * @returns {Promise<void>} A promise that resolves when the script evaluation is complete.
   * @throws {SyntaxError} If there is a syntax error in the script content or if both src attribute and script content are present.
   */
  private async _eval() {
    /**
     * Load the script and then execute it.
     */
    if (await this._load()) {
      try {
        await this._ownerDocument._executeWithTimeProfiler('script evaluation', () => {
          return this._evalInternal(this._compiledEntryCode, {
            basePath: this._basePath,
          });
        });
      } catch (error) {
        const message = `occurs an error: ${error?.message || 'Unkonwn Error'}, script: ${this.src}`;
        this.console.error(message, error);
        // reportException(this._hostObject, error);
      }
    }
  }

  /**
   * Evaluates the provided code in a sandboxed environment.
   * @param code The code to be evaluated.
   * @private
   */
  private _evalInternal(code: string, _options: { basePath: string }) {
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
