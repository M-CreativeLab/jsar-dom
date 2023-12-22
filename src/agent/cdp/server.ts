/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { EventEmitter } from 'cockatiel';
import { CdpServerEventDispatcher, CdpServerMethodHandlers } from './api';
import { CdpProtocol } from './cdp-protocol';
import { CdpSession } from './cdp-session';
import { ConnectionState } from './connection';
import { MethodNotFoundError, ProtocolError, ProtocolErrorCode } from './errors';

const makeEventDispatcher = <TDomains>(send: (event: CdpProtocol.ICommand) => void) => {
	const eventProxies = new Map(); // cache proxy creations
	const eventGetMethod = (t: { domain: string }, event: string) => (params: unknown) =>
		send({ method: `${t.domain}.${event}`, params });
	return new Proxy(
		{},
		{
			get(_, domain: string) {
				let targetEvents = eventProxies.get(domain);
				if (!targetEvents) {
					targetEvents = new Proxy({ domain }, { get: eventGetMethod });
					eventProxies.set(domain, targetEvents);
				}

				return targetEvents;
			},
		},
	) as CdpServerEventDispatcher<TDomains>;
};

/**
 * A CDP session that allows a handler to be installed for coming method
 * calls from a client, and sending events.
 */
export class ServerCdpSession<TDomains> extends CdpSession {
	private readonly handlerErrorEmitter = new EventEmitter<Error>();

	/**
	 * Helper to emit typed events.
	 */
	public readonly eventDispatcher = makeEventDispatcher<TDomains>(evt => this.send(evt));

	/**
	 * Emitter that fires if there's an uncaught error in a handler method.
	 */
	public readonly onDidThrowHandlerError = this.handlerErrorEmitter.addListener;

	/**
	 * API implementation for the server. It should be set when the server is
	 * first acquired.
	 */
	public api?: CdpServerMethodHandlers<TDomains>;

	/**
	 * @override
	 */
	public override injectMessage(cmd: CdpProtocol.Message): void {
		if (!('method' in cmd)) {
			return;
		}

		const [domain, fn] = cmd.method.split('.');
		const id = cmd.id || 0;
		if (!this.api || !this.api.hasOwnProperty(domain)) {
			this.handleUnknown(id, cmd);
			return;
		}

		const domainFns = this.api[domain as keyof CdpServerMethodHandlers<TDomains>];
		if (typeof domainFns !== 'object' || !domainFns.hasOwnProperty(fn)) {
			this.handleUnknown(id, cmd);
			return;
		}

		this.handleCall(id, () => domainFns[fn](this.eventDispatcher, cmd.params));
	}

	/**
	 * Sends a raw message on the session.
	 */
	public send(message: CdpProtocol.Message) {
		message.sessionId = this.sessionId;
		if (this.connection.state === ConnectionState.Open) {
			this.connection.object.send(message);
		}
	}

	private handleUnknown(id: number, cmd: CdpProtocol.ICommand) {
		this.handleCall(id, async () => {
			const result = await this.api?.unknown?.(this.eventDispatcher, cmd.method, cmd.params);
			if (!result) {
				throw MethodNotFoundError.create(cmd.method);
			}

			return result;
		});
	}

	private async handleCall(id: number, call: () => Promise<unknown>) {
		try {
			this.send({ id, result: await call() });
		} catch (e) {
			if (e instanceof ProtocolError) {
				this.send(e.serialize(id));
			} else {
				this.handlerErrorEmitter.emit(e);
				this.send({
					id,
					error: { code: ProtocolErrorCode.InternalError, message: e.message },
				});
			}
		}
	}

	protected disposeInner(): void {
		this.api = undefined;
	}
}
