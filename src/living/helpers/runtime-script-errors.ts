import util from 'util';

const errorReportingMode = Symbol('error reporting mode');

// https://html.spec.whatwg.org/multipage/webappapis.html#report-the-error
// Omits script parameter and any check for muted errors.
// Takes target as an EventTarget impl.
// Takes error object, message, and location as params, unlike the spec.
// Returns whether the event was handled or not.
function reportAnError(line: number, col: number, target: EventTarget, errorObject: Error, message: string, location: string) {
  if (target[errorReportingMode]) {
    return false;
  }

  target[errorReportingMode] = true;

  if (typeof message !== 'string') {
    message = 'uncaught exception: ' + util.inspect(errorObject);
  }

  const event = new ErrorEvent('error', {
    cancelable: true,
    message,
    filename: location,
    lineno: line,
    colno: col,
    error: errorObject
  });

  try {
    target.dispatchEvent(event);
  } finally {
    target[errorReportingMode] = false;
    return event.defaultPrevented;
  }
}

export function reportException(hostObject, error: Error, filenameHint?: string) {
  // This function will give good results on real Error objects with stacks; poor ones otherwise

  const stack = error && error.stack;
  const lines = stack && stack.split('\n');

  // Find the first line that matches; important for multi-line messages
  let pieces;
  if (lines) {
    for (let i = 1; i < lines.length && !pieces; ++i) {
      pieces = lines[i].match(/at (?:(.+)\s+)?\(?(?:(.+?):(\d+):(\d+)|([^)]+))\)?/);
    }
  }

  const fileName = (pieces && pieces[2]) || filenameHint;
  const lineNumber = (pieces && parseInt(pieces[3])) || 0;
  const columnNumber = (pieces && parseInt(pieces[4])) || 0;

  const handled = reportAnError(lineNumber, columnNumber, hostObject, error, error && error.message, fileName);
  if (!handled) {
    const errorString = shouldBeDisplayedAsError(error) ? `[${error.name}: ${error.message}]` : util.inspect(error);
    const jsdomError = new Error(`Uncaught ${errorString}`);
    // TODO
    // window._virtualConsole.emit('jsdomError', jsdomError);
    throw jsdomError;
  }
};

function shouldBeDisplayedAsError(x: Error) {
  return x && x.name && x.message !== undefined && x.stack;
}
