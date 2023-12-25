export type ResolveContext = {
  conditions: string[];
  importAttributes: object;
  parentURL: string | undefined;
};

export type LoadContext = {
  conditions: string[];
  importAttributes: object;
  format: string;
};

export type ResolveResult = {
  format?: string | null | undefined;
  importAttributes?: object | undefined;
  shortCircuit?: boolean | undefined;
  url: string;
};

export type LoadResult = {
  format: 'json' | 'binary' | 'module';
  shortCircuit?: boolean;
  source: string | object | ArrayBuffer | Uint8Array;
};

export type NextResolve = (specifier: string, context: ResolveContext) => ResolveResult;
export type NextLoad = (url: string, context: LoadContext) => LoadResult;

export type LoaderOnInitialize = (data: any) => void;
export type LoaderOnResolve = (specifier: string, context: ResolveContext, nextResolve: NextResolve) => ResolveResult;
export type LoaderOnLoad = (url: string, context: LoadContext, nextLoad: NextLoad) => LoadResult;
export type CustomLoaderHooks = {
  initialize?: LoaderOnInitialize;
  resolve?: LoaderOnResolve;
  load?: LoaderOnLoad;
};

export function getUrlFromResolveResult(resolved: ResolveResult): string {
  let url = resolved.url;
  if (resolved.url[0] === '/') {
    url = new URL(resolved.url, 'file://').href;
  }
  return url;
}
