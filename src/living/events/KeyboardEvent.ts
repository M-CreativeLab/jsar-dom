import DOMException from 'domexception';
import { UIEventImpl } from './UIEvent';

export default class KeyboardEventImpl extends UIEventImpl implements KeyboardEvent {
  key: string;
  code: string;
  location: number;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  repeat: boolean;
  isComposing: boolean;
  charCode: number;
  keyCode: number;

  constructor(type: string, eventInitDict?: KeyboardEventInit) {
    super(type, eventInitDict);
    this.key = eventInitDict?.key || '';
    this.code = eventInitDict?.code || '';
    this.location = eventInitDict?.location || 0;
    this.ctrlKey = eventInitDict?.ctrlKey || false;
    this.shiftKey = eventInitDict?.shiftKey || false;
    this.altKey = eventInitDict?.altKey || false;
    this.metaKey = eventInitDict?.metaKey || false;
    this.repeat = eventInitDict?.repeat || false;
    this.isComposing = eventInitDict?.isComposing || false;
    this.charCode = eventInitDict?.charCode || 0;
    this.keyCode = eventInitDict?.keyCode || 0;
    this.which = eventInitDict?.which || 0;
  }

  DOM_KEY_LOCATION_STANDARD: 0;
  DOM_KEY_LOCATION_LEFT: 1;
  DOM_KEY_LOCATION_RIGHT: 2;
  DOM_KEY_LOCATION_NUMPAD: 3;

  getModifierState(keyArg: string): boolean {
    throw new Error('KeyboardEvent.getModifierState() is not implemented.');
  }

  initKeyboardEvent(typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, viewArg?: Window, keyArg?: string, locationArg?: number, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean, metaKey?: boolean): void {
    throw new DOMException('KeyboardEvent.initKeyboardEvent() has been deprecated.');
  }
}
