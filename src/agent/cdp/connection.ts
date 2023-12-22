/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { EventEmitter } from 'cockatiel';
import { CdpProtocol } from './cdp-protocol';
import { CdpSession } from './cdp-session';
import { ClientCdpSession } from './client';
import { CdpBrowser, CdpV8 } from './definitions';
import { DeserializationError, MessageProcessingError, UnknownSessionError } from './errors';
import { ISerializer } from './serializer/index';
import { JsonSerializer } from './serializer/json';
import { ServerCdpSession } from './server';
import { ITransport, Transportable } from './transport';

type SessionCtor<T extends CdpSession> = {
  new (connection: Connection<CdpSession>, sessionId: string | undefined): T;
};

export type ClientConnection<TDomains> = Connection<ClientCdpSession<TDomains>>;
export type ServerConnection<TDomains> = Connection<ServerCdpSession<TDomains>>;

export class Connection<T extends CdpSession> {
  private readonly sessions = new Map<string, T>();
  private lastId = 1000;
  private _closed = false;
  private readonly closeEmitter = new EventEmitter<Error | undefined>();
  private readonly willSendEmitter = new EventEmitter<CdpProtocol.ICommand>();
  private readonly didReceiveEmitter = new EventEmitter<CdpProtocol.Message>();
  private readonly receiveErrorEmitter = new EventEmitter<Error>();

  /**
   * @returns true if the underlying transport is closed
   */
  public get closed() {
    return this._closed;
  }

  /**
   * Event that fires before anything is sent on the Connection.
   */
  public readonly onWillSendMessage = this.willSendEmitter.addListener;

  /**
   * Event that fires after a message is received on the connection.
   */
  public readonly onDidReceiveMessage = this.willSendEmitter.addListener;

  /**
   * Event that fires whenever an error is encountered processing received input.
   */
  public readonly onDidReceiveError = this.receiveErrorEmitter.addListener;

  /**
   * Event that fires when the transport is disconnected, or when the
   * connection is manually disposed of. If it was the result of a transport
   * error, the error is included.
   */
  public readonly onDidClose = this.closeEmitter.addListener;

  /**
   * Root CDP session.
   */
  public readonly rootSession: T = new this.sessionCtor(this, undefined);

  /**
   * Creates a CDP connection for consuming as a client.
   */
  public static client<TDomains = CdpV8.Domains & CdpBrowser.Domains>(
    transport: ITransport,
    serializer: ISerializer = new JsonSerializer(),
  ): ClientConnection<TDomains> {
    return new Connection<ClientCdpSession<TDomains>>(transport, serializer, ClientCdpSession);
  }

  /**
   * Creates a CDP connection for consuming as a server.
   */
  public static server<TDomains>(
    transport: ITransport,
    serializer: ISerializer = new JsonSerializer(),
  ): ServerConnection<TDomains> {
    return new Connection<ServerCdpSession<TDomains>>(transport, serializer, ServerCdpSession);
  }

  constructor(
    private readonly transport: ITransport,
    private readonly serializer: ISerializer,
    private readonly sessionCtor: SessionCtor<T>,
  ) {
    transport.onMessage(message => this.onMessage(message));
    transport.onEnd(err => this.onTransportClose(err));
  }

  /**
   * Primitive request message. You should usually use the `request` method on
   * the {@link ClientCDPSession} instance instead.
   */
  public request(
    method: string,
    params: Record<string, unknown> | undefined = {},
    sessionId: string | undefined,
  ): number {
    const id = ++this.lastId;
    this.send({ id, method, params, sessionId });
    return id;
  }

  /**
   * Primitive request call. You should usually use the `request` method on
   * the {@link ClientCDPSession} instance instead.
   */
  public send(message: CdpProtocol.Message) {
    this.transport.send(this.serializer.serialize(message));
  }

  /**
   * Closes the connection and transport.
   */
  public dispose() {
    this.onTransportClose(undefined);
  }

  /**
   * Gets or creates a Session with the given ID. If no ID is passed, the
   * root session is returned.
   */
  public getSession(sessionId: string | undefined) {
    if (sessionId === undefined) {
      return this.rootSession;
    }

    const existing = this.sessions.get(sessionId);
    if (existing) {
      return existing;
    }

    const session: T = new this.sessionCtor(this, sessionId);
    this.sessions.set(sessionId, session);
    session.onDidClose(() => this.sessions.delete(sessionId));
    return session;
  }

  private onTransportClose(error: Error | undefined) {
    if (this.closed) {
      return;
    }

    this._closed = true;
    this.transport.dispose();
    this.closeEmitter.emit(error);
    this.rootSession.dispose();
  }

  private onMessage(message: Transportable) {
    let object: CdpProtocol.Message;
    try {
      object = this.serializer.deserialize(message);
    } catch (e) {
      this.receiveErrorEmitter.emit(new DeserializationError(e, message));
      return;
    }

    this.didReceiveEmitter.emit(object);

    const session = object.sessionId ? this.sessions.get(object.sessionId) : this.rootSession;
    if (!session) {
      this.receiveErrorEmitter.emit(new UnknownSessionError(object));
      return;
    }

    try {
      session.injectMessage(object);
    } catch (e) {
      this.receiveErrorEmitter.emit(new MessageProcessingError(e, object));
      return;
    }
  }
}

export const enum ConnectionState {
  Open,
  Closed,
}
