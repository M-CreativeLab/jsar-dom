import DOMException from 'domexception';
import { UIEventImpl } from './UIEvent';

export class MouseEventImpl extends UIEventImpl implements MouseEvent {
  altKey: boolean;
  button: number;
  buttons: number;
  clientX: number;
  clientY: number;
  ctrlKey: boolean;
  metaKey: boolean;
  movementX: number;
  movementY: number;
  offsetX: number;
  offsetY: number;
  pageX: number;
  pageY: number;
  relatedTarget: EventTarget;
  screenX: number;
  screenY: number;
  shiftKey: boolean;

  constructor(typeArg: string, eventInitDict?: MouseEventInit) {
    super(typeArg, eventInitDict);

    this.altKey = eventInitDict?.altKey || false;
    this.button = eventInitDict?.button || 0;
    this.buttons = eventInitDict?.buttons || 0;
    this.clientX = eventInitDict?.clientX || 0;
    this.clientY = eventInitDict?.clientY || 0;
    this.ctrlKey = eventInitDict?.ctrlKey || false;
    this.metaKey = eventInitDict?.metaKey || false;
    this.movementX = eventInitDict?.movementX || 0;
    this.movementY = eventInitDict?.movementY || 0;
    this.relatedTarget = eventInitDict?.relatedTarget || null;
  }

  get x() {
    return this.clientX;
  }

  get y() {
    return this.clientY;
  }

  get mozMovementX(): number {
    throw new DOMException('This is a deprecated API. Please use MouseEvent.movementX instead.', 'NotSupportedError');
  }

  get mozMovementY(): number {
    throw new DOMException('This is a deprecated API. Please use MouseEvent.movementY instead.', 'NotSupportedError');
  }

  get webkitMovementX(): number {
    throw new DOMException('This is a deprecated API. Please use MouseEvent.movementX instead.', 'NotSupportedError');
  }

  get webkitMovementY(): number {
    throw new DOMException('This is a deprecated API. Please use MouseEvent.movementY instead.', 'NotSupportedError');
  }

  get msMovementX(): number {
    throw new DOMException('This is a deprecated API. Please use MouseEvent.movementX instead.', 'NotSupportedError');
  }

  get msMovementY(): number {
    throw new DOMException('This is a deprecated API. Please use MouseEvent.movementY instead.', 'NotSupportedError');
  }

  getModifierState(_keyArg: string): boolean {
    throw new Error('Method not implemented.');
  }

  initMouseEvent(
    _typeArg: string,
    _canBubbleArg: boolean,
    _cancelableArg: boolean,
    _viewArg: Window,
    _detailArg: number,
    _screenXArg: number,
    _screenYArg: number,
    _clientXArg: number,
    _clientYArg: number,
    _ctrlKeyArg: boolean,
    _altKeyArg: boolean,
    _shiftKeyArg: boolean,
    _metaKeyArg: boolean,
    _buttonArg: number,
    _relatedTargetArg: EventTarget
  ): void {
    throw new DOMException('This is a deprecated API. Please use UIEvent constructor instead.', 'NotSupportedError');
  }
}
