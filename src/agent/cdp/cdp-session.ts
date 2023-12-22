/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { EventEmitter, IDisposable } from 'cockatiel';
import { CdpProtocol } from './cdp-protocol';
import { Connection, ConnectionState } from './connection';

/**
 * Base CDP session that the client and server extend.
 * @internal
 */
export abstract class CdpSession implements IDisposable {
  private readonly closeEmitter = new EventEmitter<Error | undefined>();
  protected readonly disposables: IDisposable[] = [];
  protected connection:
    | { state: ConnectionState.Open; object: Connection<CdpSession> }
    | { state: ConnectionState.Closed; cause: Error | undefined };

  /**
   * Event that fires when the transport is disconnected, or when the
   * session is manually disposed of. If it was the result of a transport
   * error, the error is included.
   */
  public readonly onDidClose = this.closeEmitter.addListener;

  /**
   * @returns true if the session or underlying connection is closed
   */
  public get closed() {
    return this.connection.state === ConnectionState.Closed;
  }

  constructor(connection: Connection<CdpSession>, public readonly sessionId: string | undefined) {
    this.connection = { state: ConnectionState.Open, object: connection };
    this.disposables.push(connection.onDidClose(cause => this.disposeSelf(cause)));
  }

  /**
   * @inheritdoc
   */
  public dispose() {
    this.disposeInner(undefined);
  }

  /**
   * Handles an incoming message. Called by the connection.
   */
  public abstract injectMessage(object: CdpProtocol.Message): void;

  private disposeSelf(cause: Error | undefined) {
    if (this.connection.state === ConnectionState.Closed) {
      return;
    }

    for (const disposable of this.disposables) {
      disposable.dispose();
    }

    this.disposeInner(cause);
    this.connection = { state: ConnectionState.Closed, cause };
    this.closeEmitter.emit(cause);
  }

  protected abstract disposeInner(cause: Error | undefined): void;
}