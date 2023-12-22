/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { CdpProtocol } from '../cdp-protocol';
import { Transportable } from '../transport';

export interface ISerializer {
	/**
	 * Serializes the message for the wire.
	 */
	serialize(message: CdpProtocol.Message): Transportable;

	/**
	 * Deserializes a message from the wire.
	 */
	deserialize(message: Transportable): CdpProtocol.Message;
}
