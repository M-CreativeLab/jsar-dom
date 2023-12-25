import type assert from 'assert';
import type buffer from 'buffer';
import type { BaseWindowImpl as BaseWindow } from '../agent/window';
import type { SpatialDocumentImpl as SpatialDocument } from './nodes/SpatialDocument';

/**
 * Represents the script context interface.
 */
export interface ScriptContext {
  BABYLON: typeof BABYLON;
  Buffer: typeof buffer.Buffer;
  assert: typeof assert;

  URL: typeof URL;
  Blob: typeof Blob;
  Audio: typeof Audio;
  ImageData: typeof ImageData;
  OffscreenCanvas: typeof OffscreenCanvas;

  atob: typeof atob;
  btoa: typeof btoa;
  fetch: BaseWindow['fetch'];
  setTimeout: typeof setTimeout;
  clearTimeout: typeof clearTimeout;
  setInterval: typeof setInterval;
  clearInterval: typeof clearInterval;

  getComputedStyle: typeof getComputedStyle;
  getComputedSpatialStyle: BaseWindow['getComputedSpatialStyle'];
  createImageBitmap: typeof createImageBitmap;

  console: Console;
  navigator: Navigator;
  document: SpatialDocument;
  spatialDocument: SpatialDocument;
  /**
   * @deprecated
   */
  spaceDocument: SpatialDocument;
}
