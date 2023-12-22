/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { Event, IDisposable } from 'cockatiel';

export type Transportable = string | Uint8Array;

export interface ITransport extends IDisposable {
  /**
   * Event that fires when a message is received.
   */
  readonly onMessage: Event<Transportable>;

  /**
   * Event that fires when the transport is closed, possibly with an error
   * that caused the transport to close.
   */
  readonly onEnd: Event<Error | undefined>;

  /**
   * Sends a serialized message over the transport.
   */
  send(message: Transportable): void;
}
