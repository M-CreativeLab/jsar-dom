/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { promises as fs } from 'fs';
import * as path from 'path';
import { loadPdl2Json } from '@bindings/pdl2json';
import { pdlUrlToJson } from './pdl2json';
import { pdlToTypeScript } from './pdl2typescript';
import { platform } from 'os';

const sources = new Map([
	[
		'CdpV8',
		'https://raw.githubusercontent.com/ChromeDevTools/devtools-protocol/master/json/js_protocol.json',
	],
	[
		'CdpBrowser',
		'https://raw.githubusercontent.com/ChromeDevTools/devtools-protocol/master/json/browser_protocol.json',
	],
]);

let target = path.join(new URL(import.meta.url).pathname, '../../definitions.ts');
if (platform() === 'win32' && target[0] === '\\') {
  target = target.slice(1);
}

async function main() {
  await loadPdl2Json();

	const definitions = pdlToTypeScript(
		await Promise.all(
			[...sources].map(async ([name, url]) => ({
				name,
				definition: await pdlUrlToJson(url),
			})),
		),
	);
	await fs.writeFile(target, definitions);
}

main().catch(err => {
	console.error(err);
	process.exit(1);
});
