/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { Event, EventEmitter } from 'cockatiel';
import { CdpClientHandlers } from './api';
import { CdpProtocol } from './cdp-protocol';
import { CdpSession } from './cdp-session';
import { ConnectionState } from './connection';
import { ConnectionClosedError, ProtocolError } from './errors';

interface IProtocolCallback {
	resolve: (o: unknown) => void;
	reject: (e: Error) => void;
	stack?: string;
	method: string;
}

let shouldCaptureStackTrace = false;

/**
 * Turns on capturing of stack traces when CDP requests are issued.
 * This is useful for debugging, but has a performance overhead.
 */
export function captureCdpStackTraces(capture = true) {
	shouldCaptureStackTrace = capture;
}

const eventRe = /^on[A-Z]/;

const makeEventClient = <TDomains>(session: {
	onDidReceiveEvent: Event<CdpProtocol.ICommand>;
	request(method: string, params: Record<string, unknown>): unknown;
}) => {
	const eventProxies = new Map<
		string,
		{ emitters: Map<string, EventEmitter<unknown>>; proxy: unknown }
	>(); // cache proxy creations

	session.onDidReceiveEvent(evt => {
		const [domain, event] = evt.method.split('.');
		eventProxies.get(domain)?.emitters.get(event)?.emit(evt.params);
	});

	return new Proxy(
		{},
		{
			get(_, domain: string) {
				const existing = eventProxies.get(domain);
				if (existing) {
					return existing.proxy;
				}

				const emitters = new Map<string, EventEmitter<unknown>>();
				const proxy = new Proxy(
					{},
					{
						get(_, eventOrMethod: string) {
							if (!eventRe.test(eventOrMethod)) {
								return (params: Record<string, unknown>) =>
									session.request(`${domain}.${eventOrMethod}`, params);
							}

							// `onFoo` -> `foo`:
							const event =
								eventOrMethod.slice(2, 3).toLowerCase() + eventOrMethod.slice(3);

							const existing = emitters.get(event);
							if (existing) {
								return existing.addListener;
							}

							const emitter = new EventEmitter();
							emitters.set(event, emitter);
							return emitter.addListener;
						},
					},
				);
				eventProxies.set(domain, { emitters, proxy });

				return proxy;
			},
		},
	) as CdpClientHandlers<TDomains>;
};

/**
 * A CDP session that has methods used for consuming events from a client.
 */
export class ClientCdpSession<TDomains> extends CdpSession {
	private readonly callbacks = new Map<number, IProtocolCallback>();
	private readonly eventEmitter = new EventEmitter<CdpProtocol.ICommand>();
	private pauseQueue?: CdpProtocol.Message[];

	/**
	 * Emitter that fires whenever an event is received. Method replies
	 * are not emitted here.
	 *
	 * For a more specific, typed set of handlers, use the {@link api} property.
	 */
	public readonly onDidReceiveEvent = this.eventEmitter.addListener;

	/**
	 * Typed handler for receiving events and calling methods.
	 */
	public readonly api: CdpClientHandlers<TDomains> = makeEventClient(this);

	/**
	 * Pauses the processing of messages for the connection.
	 */
	public pause() {
		this.pauseQueue ??= [];
	}

	/**
	 * Resumes the processing of messages for the connection.
	 */
	public resume() {
		if (!this.pauseQueue) {
			return;
		}

		const toSend = this.pauseQueue;
		this.pauseQueue = undefined;
		for (const item of toSend) {
			this.processResponse(item);
		}
	}

	/**
	 * Sends a request to CDP, returning its untyped result.
	 */
	public request(method: string, params: Record<string, unknown> = {}) {
		if (this.connection.state === ConnectionState.Closed) {
			return Promise.reject(new ConnectionClosedError(this.connection.cause));
		}

		const id = this.connection.object.request(method, params, this.sessionId);
		return new Promise<unknown>((resolve, reject) => {
			const obj: IProtocolCallback = { resolve, reject, method };

			if (shouldCaptureStackTrace) {
				Error.captureStackTrace(obj);
			}

			this.callbacks.set(id, obj);
		});
	}

	/**
	 * @override
	 */
	public override injectMessage(object: CdpProtocol.Message) {
		if (!this.pauseQueue || CdpProtocol.isResponse(object)) {
			this.processResponse(object);
		} else {
			this.pauseQueue.push(object);
		}
	}

	protected override disposeInner(cause: Error | undefined) {
		for (const callback of this.callbacks.values()) {
			callback.reject(new ConnectionClosedError(cause, callback.stack));
		}

		this.callbacks.clear();
		this.pauseQueue = undefined;
	}

	private processResponse(object: CdpProtocol.Message) {
		if (object.id === undefined) {
			// for some reason, TS doesn't narrow this even though CdpProtocol.ICommand
			// is the only type of the tuple where id can be undefined.
			this.eventEmitter.emit(object as CdpProtocol.ICommand);
			return;
		}

		const callback = this.callbacks.get(object.id);
		if (!callback) {
			return;
		}

		this.callbacks.delete(object.id);
		if ('error' in object) {
			callback.reject(
				ProtocolError.from(
					{
						code: object.error.code,
						message: object.error.message,
						method: callback.method,
					},
					callback.stack,
				),
			);
		} else if ('result' in object) {
			callback.resolve(object.result);
		} else {
			/* istanbul ignore next */
			callback.reject(
				new Error(
					`Expected to have error or result in response: ${JSON.stringify(object)}`,
				),
			);
		}
	}
}
