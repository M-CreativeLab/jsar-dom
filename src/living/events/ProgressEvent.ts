import DOMException from 'domexception';

export default class ProgressEventImpl extends Event implements ProgressEvent {
  lengthComputable: boolean;
  loaded: number;
  total: number;

  constructor(type: string, eventInitDict?: ProgressEventInit) {
    super(type, eventInitDict);
    this.lengthComputable = eventInitDict?.lengthComputable || false;
    this.loaded = eventInitDict?.loaded || 0;
    this.total = eventInitDict?.total || 0;
  }

  initProgressEvent(typeArg: string, bubblesArg?: boolean, cancelableArg?: boolean, lengthComputableArg?: boolean, loadedArg?: number, totalArg?: number): void {
    throw new DOMException('ProgressEvent.initProgressEvent() has been deprecated.');
  }
}
