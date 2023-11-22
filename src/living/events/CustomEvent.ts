import DOMException from 'domexception';

export class CustomEventImpl extends Event implements CustomEvent {
  detail: any;
  constructor(type: string, options?: CustomEventInit) {
    super(type, options);

    this.detail = options?.detail || null;
  }

  initCustomEvent(type: string, bubbles?: boolean, cancelable?: boolean, detail?: any): void {
    throw new DOMException('CustomEvent.initCustomEvent() has been deprecated.');
  }
}
