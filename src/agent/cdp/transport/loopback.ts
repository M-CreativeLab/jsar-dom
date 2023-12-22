/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { EventEmitter } from 'cockatiel';
import { ITransport, Transportable } from './index';

/**
 * Transport that allows manual control, useful for testing.
 */
export class LoopbackTransport implements ITransport {
	private readonly messageEmitter = new EventEmitter<Transportable>();
	private readonly endEmitter = new EventEmitter<Error | undefined>();
	private readonly didSendEmitter = new EventEmitter<Transportable>();

	public readonly onMessage = this.messageEmitter.addListener;
	public readonly onEnd = this.endEmitter.addListener;

	/**
	 * Fires when send() is called.
	 */
	public readonly onDidSend = this.didSendEmitter.addListener;

	/**
	 * Causes `onMessage` to fire, as if a message was received.
	 */
	public receive(message: Transportable) {
		this.messageEmitter.emit(message);
	}

	/**
	 * Causes `onEnd` to fire, optionally with an error.
	 */
	public endWith(error?: Error) {
		this.endEmitter.emit(error);
	}

	/** @inheritdoc */
	public send(message: Transportable): void {
		this.didSendEmitter.emit(message);
	}

	/** @inheritdoc */
	public dispose(): void {
		// no-op
	}
}
