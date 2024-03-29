import path from 'path';
import { isWin32 } from '../../utils';

/**
 * Checks if a given string can be parsed as a valid URL.
 * @param url - The string to be checked.
 * @returns True if the string can be parsed as a valid URL, false otherwise.
 */
export function canParseURL(url: string): boolean {
  /**
   * When the url is a file path with a drive latter, it can't be parsed as a URL.
   */
  if (/^[a-zA-Z]:/.test(url)) {
    return false;
  }
  try {
    new URL(url);
    return true;
  } catch (_e) {
    return false;
  }
}

/**
 * Joins a subpath with a base path to create a new URL or file path.
 * If the base path is not an HTTP or HTTPS URL, it will be treated as a file path.
 * If the base path is an HTTP or HTTPS URL, the subpath will be appended to the URL's pathname.
 * @param sub - The subpath to join with the base path.
 * @param base - The base path to join with the subpath.
 * @returns The joined URL or file path.
 */
export function join(sub: string, base: string) {
  const isHttpOrHttps = base.startsWith('http://') || base.startsWith('https://');
  if (!isHttpOrHttps) {
    return path.join(base, sub);
  } else {
    const url = new URL(base);
    url.pathname = path.join(url.pathname, sub);
    return url.href;
  }
}
