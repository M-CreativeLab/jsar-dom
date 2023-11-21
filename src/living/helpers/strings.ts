// https://infra.spec.whatwg.org/#ascii-whitespace
export const asciiWhitespaceRe = /^[\t\n\f\r ]$/;

// https://infra.spec.whatwg.org/#ascii-lowercase
export const asciiLowercase = (s: string) => {
  return s.replace(/[A-Z]/g, l => l.toLowerCase());
};

// https://infra.spec.whatwg.org/#ascii-uppercase
export const asciiUppercase = (s: string) => {
  return s.replace(/[a-z]/g, l => l.toUpperCase());
};

// https://infra.spec.whatwg.org/#strip-newlines
export const stripNewlines = (s: string) => {
  return s.replace(/[\n\r]+/g, "");
};

// https://infra.spec.whatwg.org/#strip-leading-and-trailing-ascii-whitespace
export const stripLeadingAndTrailingASCIIWhitespace = (s: string) => {
  return s.replace(/^[ \t\n\f\r]+/, "").replace(/[ \t\n\f\r]+$/, "");
};

// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
export const stripAndCollapseASCIIWhitespace = (s: string) => {
  return s.replace(/[ \t\n\f\r]+/g, " ").replace(/^[ \t\n\f\r]+/, "").replace(/[ \t\n\f\r]+$/, "");
};

// https://html.spec.whatwg.org/multipage/infrastructure.html#valid-simple-colour
export const isValidSimpleColor = (s: string) => {
  return /^#[a-fA-F\d]{6}$/.test(s);
};

// https://infra.spec.whatwg.org/#ascii-case-insensitive
export const asciiCaseInsensitiveMatch = (a: string, b: string) => {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; ++i) {
    if ((a.charCodeAt(i) | 32) !== (b.charCodeAt(i) | 32)) {
      return false;
    }
  }

  return true;
};

// https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#rules-for-parsing-integers
// Error is represented as null.
export const parseInteger = (input: string) => {
  // The implementation here is slightly different from the spec's. We want to use parseInt(), but parseInt() trims
  // Unicode whitespace in addition to just ASCII ones, so we make sure that the trimmed prefix contains only ASCII
  // whitespace ourselves.
  const numWhitespace = input.length - input.trimStart().length;
  if (/[^\t\n\f\r ]/.test(input.slice(0, numWhitespace))) {
    return null;
  }
  // We don't allow hexadecimal numbers here.
  // eslint-disable-next-line radix
  const value = parseInt(input, 10);
  if (Number.isNaN(value)) {
    return null;
  }
  // parseInt() returns -0 for "-0". Normalize that here.
  return value === 0 ? 0 : value;
};

// https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#rules-for-parsing-non-negative-integers
// Error is represented as null.
export const parseNonNegativeInteger = (input: string) => {
  const value = parseInteger(input);
  if (value === null) {
    return null;
  }
  if (value < 0) {
    return null;
  }
  return value;
};

// https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-floating-point-number
const floatingPointNumRe = /^-?(?:\d+|\d*\.\d+)(?:[eE][-+]?\d+)?$/;
export const isValidFloatingPointNumber = (str: string) => floatingPointNumRe.test(str);

// https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#rules-for-parsing-floating-point-number-values
// Error is represented as null.
export const parseFloatingPointNumber = (str: string) => {
  // The implementation here is slightly different from the spec's. We need to use parseFloat() in order to retain
  // accuracy, but parseFloat() trims Unicode whitespace in addition to just ASCII ones, so we make sure that the
  // trimmed prefix contains only ASCII whitespace ourselves.
  const numWhitespace = str.length - str.trimStart().length;
  if (/[^\t\n\f\r ]/.test(str.slice(0, numWhitespace))) {
    return null;
  }
  const parsed = parseFloat(str);
  return isFinite(parsed) ? parsed : null;
};

// https://infra.spec.whatwg.org/#split-on-ascii-whitespace
export const splitOnASCIIWhitespace = (str: string) => {
  let position = 0;
  const tokens = [];
  while (position < str.length && asciiWhitespaceRe.test(str[position])) {
    position++;
  }
  if (position === str.length) {
    return tokens;
  }
  while (position < str.length) {
    const start = position;
    while (position < str.length && !asciiWhitespaceRe.test(str[position])) {
      position++;
    }
    tokens.push(str.slice(start, position));
    while (position < str.length && asciiWhitespaceRe.test(str[position])) {
      position++;
    }
  }
  return tokens;
};

// https://infra.spec.whatwg.org/#split-on-commas
export const splitOnCommas = (str: string) => {
  let position = 0;
  const tokens = [];
  while (position < str.length) {
    let start = position;
    while (position < str.length && str[position] !== ",") {
      position++;
    }
    let end = position;
    while (start < str.length && asciiWhitespaceRe.test(str[start])) {
      start++;
    }
    while (end > start && asciiWhitespaceRe.test(str[end - 1])) {
      end--;
    }
    tokens.push(str.slice(start, end));
    if (position < str.length) {
      position++;
    }
  }
  return tokens;
};
