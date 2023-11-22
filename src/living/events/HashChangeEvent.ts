export default class HashChangeEventImpl extends Event implements HashChangeEvent {
  oldURL: string;
  newURL: string;

  constructor(type: string, eventInitDict?: HashChangeEventInit) {
    super(type, eventInitDict);
    this.oldURL = eventInitDict?.oldURL || '';
    this.newURL = eventInitDict?.newURL || '';
  }
}
