import DOMException from 'domexception';

export default class PopStateEventImpl extends Event implements PopStateEvent {
  state: any;

  constructor(type: string, eventInitDict?: PopStateEventInit) {
    super(type, eventInitDict);
    this.state = eventInitDict?.state || null;
  }

  initPopStateEvent(typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, stateArg?: any): void {
    throw new DOMException('PopStateEvent.initPopStateEvent() has been deprecated.');
  }
}
