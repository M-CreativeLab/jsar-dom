import cssstyle from 'cssstyle';
import { ElementImpl } from './Element';
import { NativeDocument } from 'src/impl-interfaces';

export class HTMLElementImpl extends ElementImpl implements HTMLElement {
  private _settingCssText: boolean = false;
  _style: cssstyle.CSSStyleDeclaration;

  accessKey: string;
  accessKeyLabel: string;
  autocapitalize: string;

  get dir(): string {
    let dirValue = this.getAttributeNS(null, 'dir');
    if (dirValue !== null) {
      dirValue = dirValue.toLowerCase();
      if (['ltr', 'rtl', 'auto'].includes(dirValue)) {
        return dirValue;
      }
    }
    return '';
  }
  set dir(value: string) {
    this.setAttributeNS(null, 'dir', value);
  }

  draggable: boolean;
  hidden: boolean;
  inert: boolean;
  innerText: string;
  lang: string;
  offsetHeight: number;
  offsetLeft: number;
  offsetParent: Element;
  offsetTop: number;
  offsetWidth: number;
  outerText: string;
  popover: string;
  spellcheck: boolean;
  title: string;
  translate: boolean;

  attachInternals(): ElementInternals {
    throw new Error('Method not implemented.');
  }
  click(): void {
    throw new Error('Method not implemented.');
  }
  hidePopover(): void {
    throw new Error('Method not implemented.');
  }
  showPopover(): void {
    throw new Error('Method not implemented.');
  }
  togglePopover(force?: boolean): void {
    throw new Error('Method not implemented.');
  }

  attributeStyleMap: StylePropertyMap;
  get style(): CSSStyleDeclaration {
    return this._style as unknown as CSSStyleDeclaration;
  }
  contentEditable: string;
  enterKeyHint: string;
  inputMode: string;
  isContentEditable: boolean;
  onabort: (this: GlobalEventHandlers, ev: UIEvent) => any;
  onanimationcancel: (this: GlobalEventHandlers, ev: AnimationEvent) => any;
  onanimationend: (this: GlobalEventHandlers, ev: AnimationEvent) => any;
  onanimationiteration: (this: GlobalEventHandlers, ev: AnimationEvent) => any;
  onanimationstart: (this: GlobalEventHandlers, ev: AnimationEvent) => any;
  onauxclick: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  onbeforeinput: (this: GlobalEventHandlers, ev: InputEvent) => any;
  onblur: (this: GlobalEventHandlers, ev: FocusEvent) => any;
  oncancel: (this: GlobalEventHandlers, ev: Event) => any;
  oncanplay: (this: GlobalEventHandlers, ev: Event) => any;
  oncanplaythrough: (this: GlobalEventHandlers, ev: Event) => any;
  onchange: (this: GlobalEventHandlers, ev: Event) => any;
  onclick: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  onclose: (this: GlobalEventHandlers, ev: Event) => any;
  oncontextmenu: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  oncopy: (this: GlobalEventHandlers, ev: ClipboardEvent) => any;
  oncuechange: (this: GlobalEventHandlers, ev: Event) => any;
  oncut: (this: GlobalEventHandlers, ev: ClipboardEvent) => any;
  ondblclick: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  ondrag: (this: GlobalEventHandlers, ev: DragEvent) => any;
  ondragend: (this: GlobalEventHandlers, ev: DragEvent) => any;
  ondragenter: (this: GlobalEventHandlers, ev: DragEvent) => any;
  ondragleave: (this: GlobalEventHandlers, ev: DragEvent) => any;
  ondragover: (this: GlobalEventHandlers, ev: DragEvent) => any;
  ondragstart: (this: GlobalEventHandlers, ev: DragEvent) => any;
  ondrop: (this: GlobalEventHandlers, ev: DragEvent) => any;
  ondurationchange: (this: GlobalEventHandlers, ev: Event) => any;
  onemptied: (this: GlobalEventHandlers, ev: Event) => any;
  onended: (this: GlobalEventHandlers, ev: Event) => any;
  onerror: OnErrorEventHandlerNonNull;
  onfocus: (this: GlobalEventHandlers, ev: FocusEvent) => any;
  onformdata: (this: GlobalEventHandlers, ev: FormDataEvent) => any;
  ongotpointercapture: (this: GlobalEventHandlers, ev: PointerEvent) => any;
  oninput: (this: GlobalEventHandlers, ev: Event) => any;
  oninvalid: (this: GlobalEventHandlers, ev: Event) => any;
  onkeydown: (this: GlobalEventHandlers, ev: KeyboardEvent) => any;
  onkeypress: (this: GlobalEventHandlers, ev: KeyboardEvent) => any;
  onkeyup: (this: GlobalEventHandlers, ev: KeyboardEvent) => any;
  onload: (this: GlobalEventHandlers, ev: Event) => any;
  onloadeddata: (this: GlobalEventHandlers, ev: Event) => any;
  onloadedmetadata: (this: GlobalEventHandlers, ev: Event) => any;
  onloadstart: (this: GlobalEventHandlers, ev: Event) => any;
  onlostpointercapture: (this: GlobalEventHandlers, ev: PointerEvent) => any;
  onmousedown: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  onmouseenter: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  onmouseleave: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  onmousemove: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  onmouseout: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  onmouseover: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  onmouseup: (this: GlobalEventHandlers, ev: MouseEvent) => any;
  onpaste: (this: GlobalEventHandlers, ev: ClipboardEvent) => any;
  onpause: (this: GlobalEventHandlers, ev: Event) => any;
  onplay: (this: GlobalEventHandlers, ev: Event) => any;
  onplaying: (this: GlobalEventHandlers, ev: Event) => any;
  onpointercancel: (this: GlobalEventHandlers, ev: PointerEvent) => any;
  onpointerdown: (this: GlobalEventHandlers, ev: PointerEvent) => any;
  onpointerenter: (this: GlobalEventHandlers, ev: PointerEvent) => any;
  onpointerleave: (this: GlobalEventHandlers, ev: PointerEvent) => any;
  onpointermove: (this: GlobalEventHandlers, ev: PointerEvent) => any;
  onpointerout: (this: GlobalEventHandlers, ev: PointerEvent) => any;
  onpointerover: (this: GlobalEventHandlers, ev: PointerEvent) => any;
  onpointerup: (this: GlobalEventHandlers, ev: PointerEvent) => any;
  onprogress: (this: GlobalEventHandlers, ev: ProgressEvent<EventTarget>) => any;
  onratechange: (this: GlobalEventHandlers, ev: Event) => any;
  onreset: (this: GlobalEventHandlers, ev: Event) => any;
  onresize: (this: GlobalEventHandlers, ev: UIEvent) => any;
  onscroll: (this: GlobalEventHandlers, ev: Event) => any;
  onscrollend: (this: GlobalEventHandlers, ev: Event) => any;
  onsecuritypolicyviolation: (this: GlobalEventHandlers, ev: SecurityPolicyViolationEvent) => any;
  onseeked: (this: GlobalEventHandlers, ev: Event) => any;
  onseeking: (this: GlobalEventHandlers, ev: Event) => any;
  onselect: (this: GlobalEventHandlers, ev: Event) => any;
  onselectionchange: (this: GlobalEventHandlers, ev: Event) => any;
  onselectstart: (this: GlobalEventHandlers, ev: Event) => any;
  onslotchange: (this: GlobalEventHandlers, ev: Event) => any;
  onstalled: (this: GlobalEventHandlers, ev: Event) => any;
  onsubmit: (this: GlobalEventHandlers, ev: SubmitEvent) => any;
  onsuspend: (this: GlobalEventHandlers, ev: Event) => any;
  ontimeupdate: (this: GlobalEventHandlers, ev: Event) => any;
  ontoggle: (this: GlobalEventHandlers, ev: Event) => any;
  ontouchcancel?: (this: GlobalEventHandlers, ev: TouchEvent) => any;
  ontouchend?: (this: GlobalEventHandlers, ev: TouchEvent) => any;
  ontouchmove?: (this: GlobalEventHandlers, ev: TouchEvent) => any;
  ontouchstart?: (this: GlobalEventHandlers, ev: TouchEvent) => any;
  ontransitioncancel: (this: GlobalEventHandlers, ev: TransitionEvent) => any;
  ontransitionend: (this: GlobalEventHandlers, ev: TransitionEvent) => any;
  ontransitionrun: (this: GlobalEventHandlers, ev: TransitionEvent) => any;
  ontransitionstart: (this: GlobalEventHandlers, ev: TransitionEvent) => any;
  onvolumechange: (this: GlobalEventHandlers, ev: Event) => any;
  onwaiting: (this: GlobalEventHandlers, ev: Event) => any;
  onwebkitanimationend: (this: GlobalEventHandlers, ev: Event) => any;
  onwebkitanimationiteration: (this: GlobalEventHandlers, ev: Event) => any;
  onwebkitanimationstart: (this: GlobalEventHandlers, ev: Event) => any;
  onwebkittransitionend: (this: GlobalEventHandlers, ev: Event) => any;
  onwheel: (this: GlobalEventHandlers, ev: WheelEvent) => any;
  onbeforexrselect: (this: GlobalEventHandlers, ev: XRSessionEvent) => any;
  autofocus: boolean;
  dataset: DOMStringMap;
  nonce?: string;
  tabIndex: number;

  constructor(
    hostObject: NativeDocument,
    args: any[],
    privateData: ConstructorParameters<typeof ElementImpl>[2]
  ) {
    super(hostObject, args, privateData);

    this._style = new cssstyle.CSSStyleDeclaration((newCssText) => {
      if (!this._settingCssText) {
        this._settingCssText = true;
        this.setAttributeNS(null, 'style', newCssText);
        this._settingCssText = false;
      }
    });
  }

  blur(): void {
    throw new Error('Method not implemented.');
  }
  focus(options?: FocusOptions): void {
    throw new Error('Method not implemented.');
  }

  /**
   * @internal
   */
  _dispose() {
    // TODO
  }

  _attrModified(name: string, value: string, oldValue: string): void {
    if (name === 'style' && value !== oldValue && !this._settingCssText) {
      this._settingCssText = true;
      this._style.cssText = value;
      this._settingCssText = false;
    }
    super._attrModified(name, value, oldValue);
  }
}
