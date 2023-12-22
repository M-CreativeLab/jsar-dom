/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { TextDecoder } from 'util';
import { CdpProtocol } from '../cdp-protocol';
import { Transportable } from '../transport';
import { ISerializer } from './index';

export class JsonSerializer implements ISerializer {
	private decoder?: TextDecoder;

	serialize(message: CdpProtocol.Message): Transportable {
		return JSON.stringify(message);
	}

	deserialize(message: Transportable): CdpProtocol.Message {
		if (typeof message !== 'string') {
			this.decoder ??= new TextDecoder();
			message = this.decoder.decode(message);
		}

		return JSON.parse(message);
	}
}
