export default class ErrorEventImpl extends Event implements ErrorEvent {
  message: string;
  filename: string;
  lineno: number;
  colno: number;
  error: Error;

  constructor(type: string, eventInitDict?: ErrorEventInit) {
    super(type, eventInitDict);
    this.message = eventInitDict?.message || '';
    this.filename = eventInitDict?.filename || '';
    this.lineno = eventInitDict?.lineno || 0;
    this.colno = eventInitDict?.colno || 0;
    this.error = eventInitDict?.error || null;
  }
}
