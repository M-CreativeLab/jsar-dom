import { toJson } from '@bindings/pdl2json';
import { basename, join, normalize } from 'path';
import fs from 'node:fs';
import { platform } from 'os';

export async function pdlUrlToJson(pdlUrl: string) {
  let content: string;
  const urlObj = new URL(pdlUrl);
  const filename = basename(urlObj.pathname);
  let cacheFilename = join(new URL(import.meta.url).pathname, '../.pdl_cache', filename);
  if (platform() === 'win32' && cacheFilename[0] === '\\') {
    cacheFilename = cacheFilename.slice(1);
  }
  console.info(`request pdl file from ${pdlUrl}`);

  if (fs.existsSync(cacheFilename)) {
    console.info('use cached protocol:', cacheFilename);
    content = await fs.promises.readFile(cacheFilename, 'utf8');
  } else {
    content = await (await fetch(pdlUrl)).text();
  }

  if (pdlUrl.endsWith('.pdl')) {
    content = toJson(content);
  }
  return JSON.parse(content);
}
