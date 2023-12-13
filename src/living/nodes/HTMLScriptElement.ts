import path from 'path';
import assert from 'assert';
import vm from 'vm';
import * as babel from '@babel/core';
import typescriptTransformPlugin from '@babel/plugin-transform-typescript';
import commonjsTransformPlugin from '@babel/plugin-transform-modules-commonjs';

import DOMException from '../domexception';
import type { NativeDocument, ResourceLoader } from '../../impl-interfaces';
import { HTMLElementImpl } from './HTMLElement';
import { documentBaseURL, parseURLToResultingURLRecord } from '../helpers/document-base-url';
import { reportException } from '../helpers/runtime-script-errors';
import { getInterfaceWrapper } from '../interfaces';

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
  get async(): boolean {
    return this.hasAttribute('async');
  }
  set async(value: boolean) {
    this.setAttribute('async', value.toString());
  }
  /**
   * The character encoding of the external script file.
   */
  get charset(): string {
    return this.getAttribute('charset') || '';
  }
  set charset(value: string) {
    this.setAttribute('charset', value);
  }
  /**
   * The CORS (Cross-Origin Resource Sharing) setting for the script element.
   */
  get crossOrigin(): string {
    return this.getAttribute('crossorigin') || '';
  }
  set crossOrigin(value: string) {
    this.setAttribute('crossorigin', value);
  }
  /**
   * Indicates whether the script should be executed after the page has finished parsing.
   */
  get defer(): boolean {
    return this.hasAttribute('defer');
  }
  set defer(value: boolean) {
    this.setAttribute('defer', value.toString());
  }
  /**
   * The event associated with the HTMLScriptElement.
   */
  get event(): string {
    throw new DOMException('The event property is not supported.', 'NOT_SUPPORTED_ERR');
  }
  /**
   * The value of the `htmlFor` attribute of an HTML `<script>` element.
   */
  get htmlFor(): string {
    throw new DOMException('The htmlFor property is not supported.', 'NOT_SUPPORTED_ERR');
  }
  /**
   * The integrity attribute of the HTMLScriptElement.
   * It represents a cryptographic hash of the script resource being applied.
   */
  get integrity(): string {
    return this.getAttribute('integrity') || '';
  }
  /**
   * Indicates whether the script should be treated as a module or not.
   */
  get noModule(): boolean {
    return this.hasAttribute('nomodule');
  }
  /**
   * The referrer policy for the HTMLScriptElement.
   */
  get referrerPolicy(): string {
    return this.getAttribute('referrerpolicy') || '';
  }
  set referrerPolicy(value: string) {
    this.setAttribute('referrerpolicy', value);
  }
  /**
   * The source URL of the script.
   */
  get src(): string {
    return this.getAttribute('src');
  }
  set src(value: string) {
    this.setAttribute('src', value);
  }
  /**
   * The text content of the HTMLScriptElement.
   */
  get text(): string {
    return this.textContent;
  }
  set text(value: string) {
    this.textContent = value;
  }
  /**
   * The type of the script.
   */
  get type(): string {
    return this.getAttribute('type') || 'classic';
  }
  set type(value: string) {
    this.setAttribute('type', value);
  }

  /**
   * The script url in well-formed absolute format.
   * 
   * Initially, base script url is assigned to the XSML document url, then it will be re-assigned
   * when "src" attribute is resolved or changed.
   */
  private _baseScriptUrl: string;
  private _code: string = '';
  private _compiledEntryCode: string;
  private _compiledModules: Map<string, CompiledModule> = new Map();
  private _loaded: boolean = false;

  /**
   * Checks if the given type is supported by the HTMLScriptElement.
   * @param type The type to check.
   * @returns True if the type is supported, false otherwise.
   */
  static supports(type: 'classic' | 'module' | 'importmap' | 'speculationrules'): boolean {
    return type === 'classic' || type === 'module';
  }

  constructor(
    nativeDocument: NativeDocument,
    args,
    _privateData: {} = null
  ) {
    super(nativeDocument, args, {
      localName: 'script',
    });
    this._baseScriptUrl = documentBaseURL(this._ownerDocument).href;
  }

  _attach(): void {
    super._attach();

    const pending = this._eval();
    this._ownerDocument._executingScriptsObservers.add(pending);
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

  private async _addCompiledModule(url: string) {
    const resourceExt = path.extname(url);

    try {
      // handle JSON
      if (supportedJsonExtensions.includes(resourceExt)) {
        const json = await this.resourceLoader.fetch(url, {}, 'json');
        this._compiledModules.set(url, new CompiledModule(json));
        return;
      }
      // handle binary
      if (supportedBinaryExtensions.includes(resourceExt)) {
        const arraybuffer = await this.resourceLoader.fetch(url, {}, 'arraybuffer');
        this._compiledModules.set(url, new CompiledModule(arraybuffer));
        return;
      }
    } catch (err) {
      this.console.warn(`failed to fetch the module(${url}) because of ${err}.`);
    }

    // handle script (ts, mjs, js or no extension)
    if (resourceExt === '' || supportedScriptExtensions.includes(resourceExt)) {
      const scriptSource = await this._tryFetchScriptWithExtensions(url, supportedScriptExtensions);
      const result = await this._compile(scriptSource, url);
      this._compiledModules.set(url, new CompiledModule(result, true));

      // recursively add the dependencies.
      // NOTE: only script has dependencies.
      await this._addModuleRecursively(result.esmImports, url);
    }
  }

  /**
   * Recursively adds modules to the script element.
   * @param esmImports - The array of ES module imports.
   * @param baseUrl - The base path for resolving relative import paths.
   * @throws {TypeError} If the import path is not a relative path.
   */
  private async _addModuleRecursively(esmImports: string[], baseUrl: string = this._baseScriptUrl) {
    return Promise.all(
      esmImports.map(async (importPath) => {
        const isRelative = importPath.startsWith('./') || importPath.startsWith('../');
        if (isRelative) {
          await this._addCompiledModule(new URL(importPath, baseUrl).href);
        } else {
          throw new TypeError(`The import path must be relative path.`);
        }
      })
    );
  }

  /**
   * This method tries to fetch the given script with the given extensions in order.
   *
   * @param url The uri of the script.
   * @param extensions The extensions to try such as ['.ts', '.mjs', '.js'].
   * @returns The script source in utf8 encoding.
   */
  async _tryFetchScriptWithExtensions(url: string, extensions: string[]): Promise<string> {
    const triedUris: string[] = [url];
    for (let ext of extensions) {
      triedUris.push(url + ext);
      try {
        const scriptSource = await this.resourceLoader.fetch(url + ext, {}, 'string');
        return scriptSource;
      } catch (err) {
        this.console.warn(`failed to fetch the script because of ${err.message}, try next.`);
      }
    }
    try {
      return await this.resourceLoader.fetch(url, {}, 'string');
    } catch (_err) {
      const details = triedUris.map(s => `  ${s}`).join('\n');
      throw new TypeError(`Failed to fetch the script source: ${url}, tried uris:\n${details}`);
    }
  }

  /**
   * Compiles the given source code into a JavaScript code.
   * @param source The source code to compile.
   * @returns A promise that resolves to the compiled script result, which includes the compiled code and any ES module imports.
   */
  private async _compile(source: string, url: string): Promise<CompiledScriptResult> {
    return await this._ownerDocument._executeWithTimeProfiler(`code compilition(${url}, size=${source.length})`, async () => {
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
            // See https://babeljs.io/docs/babel-plugin-transform-modules-commonjs#importinterop
            importInterop: 'babel',
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
      throw new DOMException('The script element must not have both a src attribute and a script content.', 'SYNTAX_ERR');
    }
    if (!this.textContent && src) {
      const url = parseURLToResultingURLRecord(src, this._ownerDocument);
      if (url == null) {
        throw new DOMException(`The script element has an invalid src attribute: ${src}`, 'SYNTAX_ERR');
      }
      this._baseScriptUrl = url.href;
      this._code = await this._hostObject.userAgent.resourceLoader.fetch(url.href, {}, 'string');
    } else {
      this._code = this.textContent;
    }

    /**
     * 2. Compile the code.
     */
    const { code, esmImports } = await this._compile(this._code, this._baseScriptUrl);

    /**
     * 3. Load and compile the dependencies.
     */
    await this._addModuleRecursively(esmImports, this._baseScriptUrl);

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
      this._ownerDocument._queue.push(null, async () => {
        try {
          this._ownerDocument._executeWithTimeProfiler('script evaluation', () => {
            return this._evalInternal(this._compiledEntryCode, {
              baseUrl: this._baseScriptUrl,
            });
          });
        } catch (error) {
          this.console.warn('============ Script evaluation failure detection ============');
          this.console.warn(error?.stack);
          this.console.warn(`Script src: ${this.src}`);
          this.console.warn(`Script url: ${this._baseScriptUrl}`);
          this.console.warn(`${this._compiledEntryCode}`);
          this.console.warn('============ Script evaluation failure detection ============');
          reportException(this._hostObject, error);
        }
      }, null, false, this);
    }
  }

  /**
   * Evaluates the provided code in a sandboxed environment.
   * @param code The code to be evaluated.
   * @private
   */
  private _evalInternal(code: string, options: { baseUrl: string }) {
    const cjsModule = {
      exports: {},
      // FIXME(Yorkie): add other module properties? such as: `module.id`.
    };
    const windowBase = this._ownerDocument._defaultView;
    const context = {
      // Babylon.js
      BABYLON,

      // Node.js
      Buffer,
      assert,

      // Web APIs
      URL: windowBase.URL,
      Blob: windowBase.Blob,
      Audio: windowBase.Audio,
      ImageData: getInterfaceWrapper('ImageData'),
      atob: windowBase.atob,
      btoa: windowBase.btoa,
      setTimeout: windowBase.setTimeout.bind(windowBase),
      setInterval: windowBase.setInterval.bind(windowBase),
      clearTimeout: windowBase.clearTimeout.bind(windowBase),
      clearInterval: windowBase.clearInterval.bind(windowBase),
      getComputedStyle: windowBase.getComputedStyle.bind(windowBase),
      getComputedSpatialStyle: windowBase.getComputedSpatialStyle.bind(windowBase),
      get console() {
        return windowBase.console;
      },
      get navigator() {
        return windowBase.navigator;
      },
      get document() {
        return windowBase.document;
      },

      // XSML APIs
      get spatialDocument() {
        return windowBase.document;
      },
      get spaceDocument() {
        windowBase.console.warn('spaceDocument is deprecated, use `spatialDocument` instead.');
        return windowBase.document;
      },

      // cjs & esm functions
      module: cjsModule,
      exports: cjsModule.exports,
      require: this._createRequireFunction(options),
      __dynamicImport__: this._createDynamicImporter(options),
    };

    if (vm && typeof vm.runInNewContext === 'function') {
      vm.runInNewContext(code, vm.createContext(context), {
        importModuleDynamically: (_specifier) => {
          // Because we have removed the dynamic import()s in code compilation, this is impossible to be called here.
          // TODO: implement the dynamic import() here?
          throw new DOMException('Fatel error to compile the script.', 'SYNTAX_ERR');
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
    return context;
  }

  /**
   * This is a convenience method to get the exports of the module.
   * @param module the compiled module.
   * @param baseUrl the uri of the script.
   * @returns the exports of the module.
   */
  private _getModuleExports(module: CompiledModule, baseUrl: string) {
    if (module.type === 'json' || module.type === 'binary') {
      return module.result;
    }
    if (module.type === 'script') {
      const result = module.result as CompiledScriptResult;
      const ret = this._evalInternal(result.code, { baseUrl });
      return ret?.exports || {};
    }
  }

  /**
   * Creates a require function for importing modules.
   * @param options - The options for creating the require function.
   * @param options.baseUrl - The base path for resolving relative module paths.
   * @returns The require function.
   * @throws {TypeError} If the import path is not a relative path.
   * @throws {TypeError} If the module cannot be found.
   */
  private _createRequireFunction(options: { baseUrl: string }) {
    let { baseUrl } = options;
    return (id: string) => {
      const isRelative = id.startsWith('./') || id.startsWith('../');
      if (!isRelative) {
        // FIXME: only support relative path now, absolute path will be supported by the future.
        throw new TypeError(`The import path must be relative path.`);
      }
      const scriptUrl = new URL(id, baseUrl).href;
      if (!this._compiledModules.has(scriptUrl)) {
        throw new TypeError(`Could not find the module: ${id}`);
      }
      return this._getModuleExports(this._compiledModules.get(scriptUrl), scriptUrl);
    };
  }

  /**
   * Creates a importer function for dynamic `import()`.
   * @param options - The options for creating the dynamic importer.
   * @param options.basePath - The base path for resolving relative import paths.
   * @returns The dynamic importer function.
   */
  private _createDynamicImporter(options: { baseUrl: string }) {
    return async (specifier: string) => {
      const isRelative = specifier.startsWith('./') || specifier.startsWith('../');
      if (!isRelative) {
        // FIXME: only support relative path now, absolute path will be supported by the future.
        throw new TypeError(`The import path must be relative path.`);
      }
      const scriptUrl = new URL(specifier, options.baseUrl).href;
      // Load and compile the module if it is not loaded.
      if (!this._compiledModules.has(scriptUrl)) {
        await this._addCompiledModule(scriptUrl);
      }
      // Check again when the module loading is finished.
      if (!this._compiledModules.has(scriptUrl)) {
        throw new TypeError(`Could not find the module: ${specifier}`);
      }
      return this._getModuleExports(this._compiledModules.get(scriptUrl), scriptUrl);
    };
  }
}
