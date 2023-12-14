/// <reference lib="DOM" />
/// <reference types="babylonjs" />
/// <reference types="node" />
/// <reference path="jsar-api.d.ts" />
/// <reference path="loaders.d.ts" />

import { ScriptContext } from '@yodaos-jsar/dom';

declare global {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const document: ScriptContext['document'];
  const spatialDocument: ScriptContext['spatialDocument'];
  const spaceDocument: ScriptContext['spaceDocument'];
  const getComputedSpatialStyle: ScriptContext['getComputedSpatialStyle'];
}
