import DOMException from 'domexception';
import { UIEventImpl } from './UIEvent';

export default class TouchEventImpl extends UIEventImpl implements TouchEvent {
  touches: TouchList;
  targetTouches: TouchList;
  changedTouches: TouchList;
  altKey: boolean;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;

  constructor(type: string, eventInitDict?: TouchEventInit) {
    super(type, eventInitDict);
    this.touches = null;
    this.targetTouches = null;
    this.changedTouches = null;
    this.altKey = eventInitDict?.altKey || false;
    this.metaKey = eventInitDict?.metaKey || false;
    this.ctrlKey = eventInitDict?.ctrlKey || false;
    this.shiftKey = eventInitDict?.shiftKey || false;
  }

  initTouchEvent(typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, detailArg?: number, ctrlKeyArg?: boolean, altKeyArg?: boolean, shiftKeyArg?: boolean, metaKeyArg?: boolean, touchesArg?: TouchList, targetTouchesArg?: TouchList, changedTouchesArg?: TouchList): void {
    throw new DOMException('TouchEvent.initTouchEvent() has been deprecated.');
  }
}
