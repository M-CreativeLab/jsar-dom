import DOMException from 'domexception';

export default class MessageEventImpl extends Event implements MessageEvent {
  data: any;
  lastEventId: string;
  origin: string;
  ports: readonly MessagePort[];
  source: MessageEventSource;

  constructor(type: string, eventInitDict?: MessageEventInit) {
    super(type, eventInitDict);
    this.data = eventInitDict?.data || null;
    this.lastEventId = eventInitDict?.lastEventId || '';
    this.origin = eventInitDict?.origin || '';
    this.ports = eventInitDict?.ports || [];
    this.source = eventInitDict?.source || null;
  }

  initMessageEvent(type: string, bubbles?: boolean, cancelable?: boolean, data?: any, origin?: string, lastEventId?: string, source?: MessageEventSource, ports?: MessagePort[]): void;
  initMessageEvent(type: string, bubbles?: boolean, cancelable?: boolean, data?: any, origin?: string, lastEventId?: string, source?: MessageEventSource, ports?: Iterable<MessagePort>): void;
  initMessageEvent(type: unknown, bubbles?: unknown, cancelable?: unknown, data?: unknown, origin?: unknown, lastEventId?: unknown, source?: unknown, ports?: unknown): void {
    throw new DOMException('MessageEvent.initMessageEvent() has been deprecated.');
  }
}
