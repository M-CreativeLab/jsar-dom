export class CloseEventImpl extends Event implements CloseEvent {
  code: number;
  reason: string;
  wasClean: boolean;
  
  constructor(type: string, options?: CloseEventInit) {
    super(type, options);

    this.code = options?.code || 0;
    this.reason = options.reason || '';
    this.wasClean = options.wasClean || false;
  }
}
