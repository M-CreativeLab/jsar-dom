export class $Error extends Error {
  public readonly code: string;
  public constructor(code: string, message?: string) {
    super(message ? `${code}: ${message}` : code);
    this.code = code;
  }
}
