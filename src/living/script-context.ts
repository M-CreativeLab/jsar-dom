import type assert from 'assert';
import type buffer from 'buffer';
import type { BaseWindowImpl as BaseWindow } from '../agent/window';
import type { SpatialDocumentImpl as SpatialDocument } from './nodes/SpatialDocument';

/**
 * Represents the script context interface.
 */
export interface ScriptContext {
  /**
   * The Babylon.js namespace.
   */
  BABYLON: typeof BABYLON;

  /**
   * The Node.js assert function.
   */
  assert: typeof assert;

  /**
   * The Node.js Buffer class.
   */
  Buffer: typeof buffer.Buffer;

  /**
   * The Web URL class.
   */
  URL: typeof URL;

  /**
   * The Web Blob class.
   */
  Blob: typeof Blob;

  /**
   * The Web Audio/HTMLAudioElement.
   * 
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement/Audio
   */
  Audio: typeof Audio;

  /**
   * The Web ImageData class.
   * 
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ImageData/ImageData
   */
  ImageData: typeof ImageData;
  atob: typeof atob;
  btoa: typeof btoa;
  setTimeout: typeof setTimeout;
  clearTimeout: typeof clearTimeout;
  setInterval: typeof setInterval;
  clearInterval: typeof clearInterval;

  getComputedStyle: typeof getComputedStyle;
  getComputedSpatialStyle: BaseWindow['getComputedSpatialStyle'];
  console: Console;
  navigator: Navigator;
  document: SpatialDocument;
  spatialDocument: SpatialDocument;
  /**
   * @deprecated
   */
  spaceDocument: SpatialDocument;
}
