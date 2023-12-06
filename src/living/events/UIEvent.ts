import DOMException from 'domexception';

export class UIEventImpl extends Event implements UIEvent {
  detail: number;
  view: Window;
  which: number;
  inputIndex: number;
  shdaowRoot: ShadowRoot | null;

  constructor(typeArg: string, eventInitDict?: UIEventInit & { shadowRoot?: ShadowRoot }) {
    super(typeArg, eventInitDict);
    this.detail = eventInitDict?.detail || 0;
    this.shdaowRoot = eventInitDict?.shadowRoot || null;
  }

  initUIEvent(_typeArg: string, _bubblesArg?: boolean, _cancelableArg?: boolean, _viewArg?: Window, _detailArg?: number): void {
    throw new DOMException('This is a deprecated API. Please use UIEvent constructor instead.', 'NotSupportedError');
  }
}
