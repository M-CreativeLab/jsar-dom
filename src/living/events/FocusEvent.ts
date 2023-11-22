import DOMException from 'domexception';

export default class FocusEventImpl extends Event implements FocusEvent {
  relatedTarget: EventTarget;
  detail: number;
  view: Window;
  which: number;
  inputIndex: number;

  constructor(type: string, eventInitDict?: FocusEventInit) {
    super(type, eventInitDict);
    this.relatedTarget = eventInitDict?.relatedTarget || null;
  }

  initUIEvent(typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, detailArg?: number): void {
    throw new DOMException('FocusEvent.initUIEvent() has been deprecated.');
  }
}
