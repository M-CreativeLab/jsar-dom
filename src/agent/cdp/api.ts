/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { Event } from 'cockatiel';

/**
 * Primitive definition of a CDP domain.
 */
export interface IDomain {
  requests: { [key: string]: IRequestDef<unknown, unknown> };
  events: { [key: string]: IEventDef<unknown> };
}

export interface IRequestDef<TParams, TResponse> {
  params: TParams;
  result: TResponse;
}

export interface IEventDef<TParams> {
  params: TParams;
}

type DomainEventHandlers<TDomain extends IDomain> = {
  [TKey in keyof TDomain['requests']]: Record<
    string,
    never
  > extends TDomain['requests'][TKey]['params']
  ? () => Promise<TDomain['requests'][TKey]['result']>
  : (
    arg: TDomain['requests'][TKey]['params'],
  ) => Promise<TDomain['requests'][TKey]['result']>;
} &
  {
    [TKey in keyof TDomain['events']as `on${Capitalize<string & TKey>}`]: Event<
      TDomain['events'][TKey]['params']
    >;
  };

/**
 * A generic type that creates Event handler methods for a map of CDP domains.
 */
export type CdpClientHandlers<TDomains> = {
  [TKey in keyof TDomains]: TDomains[TKey] extends IDomain
  ? DomainEventHandlers<TDomains[TKey]>
  : never;
};

/**
 * Type for a handler for an API method.
 */
export type CdpMethodHandlerFunction<TDomains, TParams, TResponse> = (
  client: CdpServerEventDispatcher<TDomains>,
  arg: TParams,
) => Promise<TResponse>;

/**
 * A genmeric type that creates method handlers for a server
 * implementing the given CDP domain.
 */
export type CdpServerMethodHandlers<TDomains> = {
  [TDomainName in keyof TDomains]: TDomains[TDomainName] extends IDomain
  ? {
    [TKey in keyof TDomains[TDomainName]['requests']]: CdpMethodHandlerFunction<
      TDomains,
      TDomains[TDomainName]['requests'][TKey]['params'],
      TDomains[TDomainName]['requests'][TKey]['result']
    >;
  }
  : never;
} & {
  unknown?(
    client: CdpServerEventDispatcher<TDomains>,
    method: string,
    params: unknown,
  ): Promise<unknown | undefined>;
};

/**
 * A generic type that creates event calls for server implementing
 * the given CDP domain.
 */
export type CdpServerEventDispatcher<TDomains> = {
  [TDomainName in keyof TDomains]: TDomains[TDomainName] extends IDomain
  ? {
    [TKey in keyof TDomains[TDomainName]['events']]: (
      arg: TDomains[TDomainName]['events'][TKey]['params'],
    ) => void;
  }
  : never;
};
