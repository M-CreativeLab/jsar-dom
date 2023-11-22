export function canParseURL(url): boolean {
  try {
    new URL(url);
    return true;
  } catch (_e) {
    return false;
  }
}
