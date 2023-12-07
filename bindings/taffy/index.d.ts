export function loadTaffy();

/**
 * FIXME: the below are copied from ./pkg/taffy_binding.d.ts, the typescript failed on GitHub Actions
 * when we use export * from '...'.
 */

/* tslint:disable */
/* eslint-disable */
/**
*/
export enum JustifySelf {
    FlexStart = 0,
    FlexEnd = 1,
    Start = 2,
    End = 3,
    Center = 4,
    Baseline = 5,
    Stretch = 6,
}
/**
*/
export enum GridAutoFlow {
    Row = 0,
    Column = 1,
    RowDense = 2,
    ColumnDense = 3,
}
/**
*/
export enum Display {
    Flex = 0,
    Grid = 1,
    None = 2,
}
/**
*/
export enum JustifyItems {
    FlexStart = 0,
    FlexEnd = 1,
    Start = 2,
    End = 3,
    Center = 4,
    Baseline = 5,
    Stretch = 6,
}
/**
*/
export enum FlexDirection {
    Row = 0,
    Column = 1,
    RowReverse = 2,
    ColumnReverse = 3,
}
/**
*/
export enum AlignItems {
    FlexStart = 0,
    FlexEnd = 1,
    Start = 2,
    End = 3,
    Center = 4,
    Baseline = 5,
    Stretch = 6,
}
/**
*/
export enum JustifyContent {
    FlexStart = 0,
    FlexEnd = 1,
    Start = 2,
    End = 3,
    Center = 4,
    SpaceBetween = 5,
    SpaceAround = 6,
    SpaceEvenly = 7,
}
/**
*/
export enum AlignContent {
    FlexStart = 0,
    FlexEnd = 1,
    Start = 2,
    End = 3,
    Center = 4,
    Stretch = 5,
    SpaceBetween = 6,
    SpaceAround = 7,
}
/**
*/
export enum Position {
    Relative = 0,
    Absolute = 1,
}
/**
*/
export enum FlexWrap {
    NoWrap = 0,
    Wrap = 1,
    WrapReverse = 2,
}
/**
*/
export enum AlignSelf {
    FlexStart = 0,
    FlexEnd = 1,
    Start = 2,
    End = 3,
    Center = 4,
    Baseline = 5,
    Stretch = 6,
}
/**
*/
export class Allocator {
    free(): void;
    /**
    */
    constructor();
}
/**
*/
export class Layout {
    free(): void;
    /**
    * @param {number} at
    * @returns {Layout}
    */
    child(at: number): Layout;
    /**
    */
    readonly childCount: number;
    /**
    */
    readonly height: number;
    /**
    */
    readonly width: number;
    /**
    */
    readonly x: number;
    /**
    */
    readonly y: number;
}
/**
*/
export class Node {
    free(): void;
    /**
    * @param {Allocator} allocator
    * @param {any} style
    */
    constructor(allocator: Allocator, style: any);
    /**
    * @param {any} measure
    */
    setMeasure(measure: any): void;
    /**
    * @param {Node} child
    */
    addChild(child: Node): void;
    /**
    * @param {Node} child
    */
    removeChild(child: Node): void;
    /**
    * @param {number} index
    * @param {Node} child
    */
    replaceChildAtIndex(index: number, child: Node): void;
    /**
    * @param {number} index
    */
    removeChildAtIndex(index: number): void;
    /**
    * @returns {any}
    */
    getStyle(): any;
    /**
    * @param {any} style
    */
    setStyle(style: any): void;
    /**
    */
    markDirty(): void;
    /**
    * @returns {boolean}
    */
    isDirty(): boolean;
    /**
    * @returns {boolean}
    */
    isChildless(): boolean;
    /**
    * @param {any} size
    * @returns {Layout}
    */
    computeLayout(size: any): Layout;
    /**
    */
    readonly childCount: number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_layout_free: (a: number) => void;
    readonly __wbg_get_layout_width: (a: number) => number;
    readonly __wbg_get_layout_height: (a: number) => number;
    readonly __wbg_get_layout_x: (a: number) => number;
    readonly __wbg_get_layout_y: (a: number) => number;
    readonly __wbg_get_layout_childCount: (a: number) => number;
    readonly layout_child: (a: number, b: number) => number;
    readonly __wbg_allocator_free: (a: number) => void;
    readonly allocator_new: () => number;
    readonly __wbg_node_free: (a: number) => void;
    readonly __wbg_get_node_childCount: (a: number) => number;
    readonly node_new: (a: number, b: number) => number;
    readonly node_setMeasure: (a: number, b: number) => void;
    readonly node_addChild: (a: number, b: number) => void;
    readonly node_removeChild: (a: number, b: number) => void;
    readonly node_replaceChildAtIndex: (a: number, b: number, c: number) => void;
    readonly node_removeChildAtIndex: (a: number, b: number) => void;
    readonly node_getStyle: (a: number) => number;
    readonly node_setStyle: (a: number, b: number) => void;
    readonly node_markDirty: (a: number) => void;
    readonly node_isDirty: (a: number) => number;
    readonly node_isChildless: (a: number) => number;
    readonly node_computeLayout: (a: number, b: number) => number;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init(module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
