/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CdpProtocol {
  export interface ICommand {
    id?: number;
    method: string;
    params: unknown;
    sessionId?: string;
  }

  export interface IError {
    id: number;
    error: { code: number; message: string };
    sessionId?: string;
  }

  export interface ISuccess {
    id: number;
    result: unknown;
    sessionId?: string;
  }

  export type Message = ICommand | ISuccess | IError;

  export const isCommand = (message: Message): message is ICommand => 'method' in message;
  export const isResponse = (message: Message): message is IError | ISuccess =>
    'error' in message || 'result' in message;
}
