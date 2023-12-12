import DOMExceptionImpl from '../living/domexception';
import { reportException } from '../living/helpers/runtime-script-errors';
import type { BaseWindowImpl } from './window';

type TimerConfig = {
  methodContext: BaseWindowImpl;
  repeat: boolean;
  previousHandle?: number;
};

const listOfActiveTimers = new Map<number, NodeJS.Timeout>();
let latestTimerId = 0;

export function timerInitializationSteps(
  handler: TimerHandler,
  timeout: number,
  args: any[],
  config: TimerConfig,
) {
  const { methodContext, repeat, previousHandle } = config;

  // This appears to be unspecced, but matches browser behavior for close()ed windows.
  if (!methodContext.document) {
    return 0;
  }

  // TODO: implement timer nesting level behavior.
  const handle = previousHandle !== undefined ? previousHandle : ++latestTimerId;

  function task() {
    if (!listOfActiveTimers.has(handle)) {
      return;
    }

    try {
      if (typeof handler === 'function') {
        handler.apply(methodContext, args);
      } else {
        // TODO: implement string timer function?
        throw new DOMExceptionImpl('The callback provided as parameter 1 is not a function.', 'TYPE_MISMATCH_ERR');
      }
    } catch (e) {
      reportException(window, e, window.location.href);
    }

    if (listOfActiveTimers.has(handle)) {
      if (repeat) {
        timerInitializationSteps(
          handler,
          timeout,
          args,
          { methodContext, repeat, previousHandle: handle }
        );
      } else {
        listOfActiveTimers.delete(handle);
      }
    }
  }

  if (timeout < 0) {
    timeout = 0;
  }
  const nodejsTimer = setTimeout(task, timeout);
  listOfActiveTimers.set(handle, nodejsTimer);
  return handle;
}

export function clearTimer(handle: number) {
  const nodejsTimer = listOfActiveTimers.get(handle);
  if (nodejsTimer) {
    clearTimeout(nodejsTimer);
    listOfActiveTimers.delete(handle);
  }
}

export function stopAllTimers() {
  for (const nodejsTimer of listOfActiveTimers.values()) {
    clearTimeout(nodejsTimer);
  }
  listOfActiveTimers.clear();
}
