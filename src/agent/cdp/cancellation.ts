/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { Event, IDisposable, TaskCancelledError } from 'cockatiel';

export interface ICancellationToken {
	readonly onCancellationRequested: Event<void>;
	readonly isCancellationRequested: boolean;
}

/**
 * Returns the result of the promise if it resolves before the cancellation
 * is requested. Otherwise, throws a TaskCancelledError.
 */
export function timeoutPromise<T>(
	promise: Promise<T>,
	cancellation: ICancellationToken,
	message?: string,
): Promise<T> {
	if (cancellation.isCancellationRequested) {
		return Promise.reject(new TaskCancelledError(message || 'Task cancelled'));
	}

	let disposable: IDisposable;

	return Promise.race([
		new Promise<never>((_resolve, reject) => {
			disposable = cancellation.onCancellationRequested(() =>
				reject(new TaskCancelledError(message || 'Task cancelled')),
			);
		}),
		promise.finally(() => disposable.dispose()),
	]);
}
