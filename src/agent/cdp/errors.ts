/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { CdpProtocol } from './cdp-protocol';
import { Transportable } from './transport';

export const enum ProtocolErrorCode {
	// CDP Errors:
	// @see https://source.chromium.org/chromium/chromium/src/+/master:v8/third_party/inspector_protocol/crdtp/dispatch.h;drc=3573d5e0faf3098600993625b3f07b83f8753867
	ParseError = -32700,
	InvalidRequest = -32600,
	MethodNotFound = -32601,
	InvalidParams = -32602,
	InternalError = -32603,
	ServerError = -32000,
}

/**
 * Base error extended by all other errors the library emits.
 */
export class CdpError extends Error {}

export interface IProtocolErrorCause {
	code: number;
	method: string;
	message: string;
}

/**
 * Class thrown on an error returned from the remote CDP server.
 */
export class ProtocolError extends CdpError {
	/**
	 * Creates a correctly-typed error from the protocol cause.
	 */
	public static from(
		cause: IProtocolErrorCause,
		originalStack: string | undefined,
	): ProtocolError {
		switch (cause.code) {
			case ProtocolErrorCode.ParseError:
				return new ProtocolParseError(cause, originalStack);
			case ProtocolErrorCode.InvalidRequest:
				return new InvalidRequestError(cause, originalStack);
			case ProtocolErrorCode.MethodNotFound:
				return new MethodNotFoundError(cause, originalStack);
			case ProtocolErrorCode.InvalidParams:
				return new InvalidParametersError(cause, originalStack);
			case ProtocolErrorCode.InternalError:
				return new InternalError(cause, originalStack);
			case ProtocolErrorCode.ServerError:
				return new ServerError(cause, originalStack);
			default:
				return new ProtocolError(cause, originalStack);
		}
	}

	constructor(public readonly cause: IProtocolErrorCause, originalStack?: string) {
		super(`CDP error ${cause.code} calling method ${cause.method}: ${cause.message}`);
		if (originalStack) {
			this.stack = originalStack;
		}
	}

	public serialize(id: number): CdpProtocol.IError {
		return { id, error: { code: this.cause.code, message: this.cause.message } };
	}
}

export class ProtocolParseError extends ProtocolError {}

export class InvalidRequestError extends ProtocolError {}

export class MethodNotFoundError extends ProtocolError {
	public static create(method: string) {
		return new MethodNotFoundError({
			code: ProtocolErrorCode.MethodNotFound,
			method,
			message: `Method ${method} not found`,
		});
	}
}

export class InvalidParametersError extends ProtocolError {}

export class InternalError extends ProtocolError {}

export class ServerError extends ProtocolError {}

/**
 * Error thrown from CDP commands if the connection is closed before the
 * command returns.
 */
export class ConnectionClosedError extends CdpError {
	constructor(public readonly cause?: Error, originalStack?: string) {
		super(cause ? cause.message : 'Connection closed');
		if (originalStack) {
			this.stack = originalStack;
		}
	}
}

/**
 * Error emitted on the {@link Connection.onDidReceiveError} when
 * deserialization of input fails.
 */
export class DeserializationError extends CdpError {
	constructor(public readonly cause: Error, public readonly protocolMessage: Transportable) {
		super(`Deserialization of a message failed: ${cause.message}`);
	}
}

/**
 * Error emitted on the {@link Connection.onDidReceiveError} when a message
 * is received for an unknown session.
 */
export class UnknownSessionError extends CdpError {
	constructor(public readonly protocolMessage: CdpProtocol.Message) {
		super(`Message received for unknown session ID`);
	}
}

/**
 * Error emitted on the {@link Connection.onDidReceiveError} when a the process
 * of emitted a received message results in an error. Usually this will be
 * from user code.
 */
export class MessageProcessingError extends CdpError {
	constructor(
		public readonly cause: Error,
		public readonly protocolMessage: CdpProtocol.Message,
	) {
		super(`Error processing a CDP message: ${cause.message}`);
		if (cause.stack) {
			this.stack = cause.stack;
		}
	}
}
