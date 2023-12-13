/// <reference path="node_modules/@types/wicg-file-system-access/index.d.ts" />

import {
  SpatialDocumentImpl,
  DOMParser,
  NativeDocument,
  NativeEngine,
  RequestManager,
  ResourceLoader,
  UserAgent,
  UserAgentInit,
  JSARDOM,
} from '../src';
import 'babylonjs';

import { canParseURL } from '../src/living/helpers/url';
import { JSARInputEvent } from '../src/input-event';
import { SPATIAL_OBJECT_GUID_SYMBOL } from '../src/symbols';

interface EngineOnBabylonjs extends BABYLON.Engine, EventTarget { }
class EngineOnBabylonjs extends BABYLON.Engine implements NativeEngine {
  // TODO
}

class HeadlessResourceLoader implements ResourceLoader {
  fetch(url: string, options: { accept?: string; cookieJar?: any; referrer?: string; }, returnsAs: 'string'): Promise<string>;
  fetch(url: string, options: { accept?: string; cookieJar?: any; referrer?: string; }, returnsAs: 'json'): Promise<object>;
  fetch(url: string, options: { accept?: string; cookieJar?: any; referrer?: string; }, returnsAs: 'arraybuffer'): Promise<ArrayBuffer>;
  fetch<T = string | object | ArrayBuffer>(url: string, options: { accept?: string; cookieJar?: any; referrer?: string; }, returnsAs?: 'string' | 'json' | 'arraybuffer'): Promise<T>;
  fetch(url: string, options: { accept?: string; cookieJar?: any; referrer?: string; }, returnsAs?: 'string' | 'json' | 'arraybuffer'): Promise<object> | Promise<ArrayBuffer> | Promise<string> {
    if (!canParseURL(url)) {
      throw new TypeError('Invalid URL');
    }
    const urlObj = new URL(url);
    if (urlObj.protocol === 'file:') {
      throw new TypeError('file: protocol is not supported');
    } else {
      return fetch(url, options)
        .then((resp) => {
          if (returnsAs === 'string') {
            return resp.text();
          } else if (returnsAs === 'json') {
            return resp.json();
          } else if (returnsAs === 'arraybuffer') {
            return resp.arrayBuffer();
          }
        });
    }
  }
}

class UserAgentOnBabylonjs implements UserAgent {
  versionString: string = '1.0';
  vendor: string = '';
  vendorSub: string = '';
  language: string = 'zh-CN';
  languages: readonly string[] = [
    'zh-CN',
    'en-US',
  ];
  defaultStylesheet: string;
  devicePixelRatio: number;
  domParser: DOMParser;
  resourceLoader: ResourceLoader;
  requestManager: RequestManager;

  constructor(init: UserAgentInit) {
    this.defaultStylesheet = init.defaultStylesheet;
    this.devicePixelRatio = init.devicePixelRatio;
    this.resourceLoader = new HeadlessResourceLoader();
    // this.requestManager = null;
  }
  alert(message?: string): void {
    throw new Error('Method not implemented.');
  }
  confirm(message?: string): boolean {
    throw new Error('Method not implemented.');
  }
  prompt(message?: string, defaultValue?: string): string {
    throw new Error('Method not implemented.');
  }
}

const MIN_WIDTH_SHOW_DEBUGGER = 1024;

class NativeDocumentOnBabylonjs extends EventTarget implements NativeDocument {
  engine: NativeEngine;
  userAgent: UserAgent;
  baseURI: string;
  console: Console;
  attachedDocument: SpatialDocumentImpl;
  closed: boolean = false;

  private _scene: BABYLON.Scene;
  private _preloadMeshes: Map<string, Array<BABYLON.AbstractMesh | BABYLON.TransformNode>> = new Map();
  private _preloadAnimationGroups: Map<string, BABYLON.AnimationGroup[]> = new Map();

  constructor(canvas: HTMLCanvasElement) {
    super();

    const screenWidth = window.outerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.engine = new EngineOnBabylonjs(canvas, true);
    this.userAgent = new UserAgentOnBabylonjs({
      defaultStylesheet: '',
      devicePixelRatio: 1,
    });
    this.console = globalThis.console;
    const scene = this._scene = new BABYLON.Scene(this.engine);
    this._scene.clearColor = new BABYLON.Color4(0.5, 0.5, 0.5, 1);
    this._scene.debugLayer.show({
      showExplorer: screenWidth > MIN_WIDTH_SHOW_DEBUGGER,
      showInspector: screenWidth > MIN_WIDTH_SHOW_DEBUGGER,
      globalRoot: document.getElementById('babylonjs-root') as HTMLDivElement,
    });

    const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
      'https://assets.babylonjs.com/environments/environmentSpecular.env', this._scene);
    this._scene.environmentTexture = hdrTexture;

    // create camera and targets
    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      Math.PI / 2,
      Math.PI / 2,
      5,
      BABYLON.Vector3.Zero(),
      this._scene
    );
    // camera.upperRadiusLimit = 10;
    camera.lowerRadiusLimit = 2;
    camera.wheelDeltaPercentage = 0.01;

    camera.setPosition(new BABYLON.Vector3(0, 0, -5));
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, false, true);

    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 2, -5), this._scene);
    light.intensity = 0.7;

    this.engine.runRenderLoop(() => {
      this._scene.render();
    });
    window.addEventListener('resize', () => {
      const screenWidth = window.outerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      this._scene.debugLayer.hide();
      this._scene.debugLayer.show({
        showExplorer: screenWidth > MIN_WIDTH_SHOW_DEBUGGER,
        showInspector: screenWidth > MIN_WIDTH_SHOW_DEBUGGER,
      });
      this.engine.resize();
    });

    let lastCameraState = [camera.alpha, camera.beta, camera.radius];
    let isCameraMoving = false;
    scene.onAfterCameraRenderObservable.add(() => {
      if (lastCameraState[0] !== camera.alpha || lastCameraState[1] !== camera.beta || lastCameraState[2] !== camera.radius) {
        isCameraMoving = true;
      } else {
        isCameraMoving = false;
      }
      lastCameraState = [camera.alpha, camera.beta, camera.radius];
    });
    scene.onBeforeRenderObservable.add(() => {
      if (isCameraMoving === true) {
        return;
      }
      const pickingInfo = scene.pick(scene.pointerX, scene.pointerY);
      if (currentDom && pickingInfo.pickedMesh) {
        const raycastEvent = new JSARInputEvent('raycast', {
          sourceId: 'scene_default_ray',
          sourceType: 'mouse',
          targetSpatialElementInternalGuid: pickingInfo.pickedMesh[SPATIAL_OBJECT_GUID_SYMBOL],
          uvCoord: pickingInfo.getTextureCoordinates(),
        });
        currentDom.dispatchInputEvent(raycastEvent);
      }
    });

    function handlePointerDown() {
      if (!isCameraMoving && currentDom) {
        currentDom.dispatchInputEvent(
          new JSARInputEvent('raycast_action', {
            sourceId: 'scene_default_ray',
            type: 'down',
          })
        );
      }
    }
    function handlePointerUp() {
      if (!isCameraMoving && currentDom) {
        currentDom.dispatchInputEvent(
          new JSARInputEvent('raycast_action', {
            sourceId: 'scene_default_ray',
            type: 'up',
          })
        );
      }
    }
    scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERUP:
          handlePointerUp();
          break;
        case BABYLON.PointerEventTypes.POINTERDOWN:
          handlePointerDown();
          break;
        default:
          break;
      }
    });
  }

  getNativeScene(): BABYLON.Scene {
    return this._scene;
  }
  getContainerPose(): XRPose {
    throw new Error('Method not implemented.');
  }
  getPreloadedMeshes(): Map<string, Array<BABYLON.AbstractMesh | BABYLON.TransformNode>> {
    return this._preloadMeshes;
  }
  getPreloadedAnimationGroups(): Map<string, BABYLON.AnimationGroup[]> {
    return this._preloadAnimationGroups;
  }
  observeInputEvent(name?: string): void {
    // TODO
  }
  createBoundTransformNode(nameOrId: string): BABYLON.TransformNode {
    throw new Error('Method not implemented.');
  }
  stop(): void {
    // TODO
  }
  close(): void {
    this.engine.stopRenderLoop();
    this.engine.dispose();
    this._scene.dispose();
  }
}

const defaultCode: string = `
<xsml>
  <head>
    <style>
      @keyframes rotate {
        from {
          rotation: 0 0 30;
        }
        to {
          rotation: 0 360 30;
        }
      }

      cube {
        animation: rotate 5s linear infinite;
      }
      plane {
        position: 0.25 0.5 -1;
      }
    </style>
  </head>
  <space>
    <cube />
    <plane height="0.5" width="1.5">
      <div>
        <span>Hello JSAR!</span>
        <span style="font-size: 50px;">Type your XSML in the below input</span>
      </div>
      <style type="text/css">
        div {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          gap: 20px;
        }
        span {
          flex: 1;
          color: red;
          font-size: 150px;
          line-height: 1.5;
        }
      </style>
    </plane>
    <script>
      const cube = document.querySelector('cube');
      if (cube) {
        cube.addEventListener('rayenter', () => {
          cube.asNativeType<BABYLON.AbstractMesh>().renderOutline = true;
          cube.asNativeType<BABYLON.AbstractMesh>().outlineColor = new BABYLON.Color3(0, 1, 1);
        });
        cube.addEventListener('rayleave', () => {
          cube.asNativeType<BABYLON.AbstractMesh>().renderOutline = false;
        });
      }

    </script>
  </space>
</xsml>
`;

let currentDom: JSARDOM<NativeDocumentOnBabylonjs>;
document.addEventListener('DOMContentLoaded', async () => {
  const canvas = document.getElementById('renderCanvas');
  const urlInput = document.getElementById('url-input') as HTMLInputElement;
  const selectBtn = document.getElementById('run-btn');
  selectBtn?.addEventListener('click', async () => {
    if (!urlInput?.value) {
      await load(defaultCode);
    } else {
      const entryXsmlCode = await (await fetch(urlInput?.value)).text();
      await load(entryXsmlCode, urlInput?.value);
    }
  });
  if (!(await loadFromUrl())) {
    await load(defaultCode);
  }

  async function loadFromUrl(): Promise<boolean> {
    if (location.search && location.href) {
      const url = new URL(location.href).searchParams.get('url');
      if (url) {
        const code = await (await fetch(url)).text();
        load(code, url);
        return true;
      }
    }
    return false;
  }

  async function load(code: string, urlBase: string = 'https://example.com/') {
    if (currentDom) {
      await currentDom.unload();
    }
    const nativeDocument = new NativeDocumentOnBabylonjs(canvas as HTMLCanvasElement);
    currentDom = new JSARDOM(code, {
      url: urlBase,
      nativeDocument,
    });
    await currentDom.load();
    console.log(currentDom);

    const scene = currentDom.document.scene;
    BABYLON.SceneLoader.ImportMesh(
      ['GitHub Pin UwU_14'],
      'https://m-creativelab.github.io/jsar-dom/assets/',
      '3d_skill__role_badges_and_pins.glb',
      scene,
      () => {
        const githubTransform = scene.getTransformNodeById('GitHub Pin UwU_14');
        if (githubTransform) {
          githubTransform.position = new BABYLON.Vector3(1.7, -2, 1);
          githubTransform.rotation = new BABYLON.Vector3(Math.PI, 0, 0);
          githubTransform.billboardMode = 7;
          scene.onPointerMove = function() {
            const pickingInfo = scene.pick(scene.pointerX, scene.pointerY);
            if (pickingInfo.hit && pickingInfo.pickedMesh?.isDescendantOf(githubTransform)) {
              githubTransform.getChildMeshes().forEach(mesh => {
                (mesh.material as BABYLON.PBRMaterial).emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);
              });
            } else {
              githubTransform.getChildMeshes().forEach(mesh => {
                (mesh.material as BABYLON.PBRMaterial).emissiveColor = new BABYLON.Color3(0, 0, 0);
              });
            }
          };
          scene.onPointerUp = function() {
            const pickingInfo = scene.pick(scene.pointerX, scene.pointerY);
            if (pickingInfo.hit && pickingInfo.pickedMesh?.isDescendantOf(githubTransform)) {
              githubTransform.getChildMeshes().forEach(mesh => {
                (mesh.material as BABYLON.PBRMaterial).emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);
              });
              setTimeout(() => {
                window.open('https://github.com/M-CreativeLab/jsar-dom', '_blank');
              }, 100);
            }
          };
          scene.onPointerDown = function() {
            const pickingInfo = scene.pick(scene.pointerX, scene.pointerY);
            if (pickingInfo.hit && pickingInfo.pickedMesh?.isDescendantOf(githubTransform)) {
              githubTransform.getChildMeshes().forEach(mesh => {
                (mesh.material as BABYLON.PBRMaterial).emissiveColor = new BABYLON.Color3(1, 0.7, 0.7);
              });
            }
          };
        }
      });
  }

});
