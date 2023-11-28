type ResourceQueueInit = {
  paused: boolean;
  asyncQueue?: AsyncResourceQueue;
};

type QueueItemInit = {
  prev: QueueItem;
  element: Element;
  isScript: boolean;
  keepLast: boolean;
  onload?: (data?: any) => Promise<void>;
  onerror?: (e: Error) => Promise<void>;
};

class QueueItemBase {
  data: any = null;
  error: Error = null;
  fired: boolean = false;
  finished: boolean = false;
  onload: QueueItemInit['onload'];
  onerror: QueueItemInit['onerror'];
}

class QueueItem extends QueueItemBase {
  prev: QueueItem = null;
  next: QueueItem = null;
  element: Element = null;
  isScript: boolean;
  keepLast: boolean;

  /** the context queue object */
  #q: ResourceQueue;

  constructor(
    q: ResourceQueue,
    init: QueueItemInit,
  ) {
    super();

    this.#q = q;
    this.prev = init.prev;
    this.element = init.element;
    this.isScript = init.isScript || false;
    this.keepLast = init.keepLast || false;
    this.onload = init.onload;
    this.onerror = init.onerror;
  }

  check() {
    if (!this.#q.paused && !this.prev && this.fired) {
      let promise: Promise<void>;
      if (this.error && this.onerror) {
        promise = this.onerror(this.error);
      } else if (this.onload) {
        promise = this.onload();
      }

      Promise.resolve(promise)
        .then(() => {
          if (this.next) {
            this.next.prev = null;
            this.next.check();
          } else {
            this.#q.tail = null;
            this.#q._notify();
          }

          this.finished == true;
          if (this.#q._asyncQueue) {
            this.#q._asyncQueue.notifyItem(this);
          }
        });
    }
  }
}

class AsyncQueueItem extends QueueItemBase {
  dependentItem: AsyncQueueItem;

  constructor(
    onload: QueueItemInit['onload'],
    onerror: QueueItemInit['onerror'],
    dependentItem: AsyncQueueItem
  ) {
    super();

    this.dependentItem = dependentItem;
    this.onload = onload;
    this.onerror = onerror;
  }
}

class ResourceQueueBase {
  _listener: () => void;
  _notify() {
    if (typeof this._listener === 'function') {
      this._listener();
    }
  }
  setListener(listener: () => void) {
    this._listener = listener;
  }
}

export class AsyncResourceQueue extends ResourceQueueBase {
  items: Set<AsyncQueueItem> = new Set();
  dependentItems: Set<AsyncQueueItem> = new Set();

  count() {
    return this.items.size + this.dependentItems.size;
  }

  _check(item: AsyncQueueItem) {
    let promise: Promise<void>;
    if (item.error && item.onerror) {
      promise = item.onerror(item.error);
    } else if (item.onload) {
      promise = item.onload(item.data);
    }

    promise
      .then(() => {
        this.items.delete(item);
        this.dependentItems.delete(item);

        if (this.count() === 0) {
          this._notify();
        }
      });
  }

  push(
    request: Promise<any>,
    onload: QueueItemInit['onload'],
    onerror: QueueItemInit['onerror'],
    dependentItem: AsyncQueueItem
  ) {
    const item = new AsyncQueueItem(onload, onerror, dependentItem);
    this.items.add(item);

    return request
      .then(data => {
        item.data = data;
        if (dependentItem && !dependentItem.finished) {
          this.dependentItems.add(item);
          return this.items.delete(item);
        }
        if (onload) {
          return this._check(item);
        }

        this.items.delete(item);
        if (this.count() === 0) {
          this._notify();
        }
        return null;
      });
  }

  notifyItem(_syncItem: QueueItem) {
    // for (const item of this.dependentItems) {
    //   if (item.dependentItem === syncItem) {
    //     this._check(item);
    //   }
    // }
  }
}

/**
 * Queue for all resources to be download except async scripts.
 * Async scripts have their own queue `AsyncResourceQueue`.
 */
export class ResourceQueue extends ResourceQueueBase {
  paused: boolean;
  tail: QueueItem = null;

  /**
   * @internal
   */
  _asyncQueue: AsyncResourceQueue;

  constructor(
    { paused, asyncQueue }: ResourceQueueInit = { paused: false, asyncQueue: null }
  ) {
    super();
    this.paused = paused;
    this._asyncQueue = asyncQueue;
  }

  /**
   * Retrieves the last script in the resource queue.
   * @returns The last script in the queue, or null if no script is found.
   */
  getLastScript(): QueueItem {
    let head = this.tail;
    while (head) {
      if (head.isScript) {
        return head;
      }
      head = head.prev;
    }
    return null;
  }

  _hasMoreScripts() {
    let found = false;
    let head = this.tail;
    while (head && !found) {
      found = head.isScript;
      head = head.prev;
    }
    return found;
  }

  push(
    request: Promise<any>,
    onload: QueueItemInit['onload'],
    onerror: QueueItemInit['onerror'],
    keepLast?: boolean,
    element?: Element,
  ): Promise<void> {
    const isScript = element ? element.localName === 'script' : false;
    if (!request) {
      if (isScript && !this._hasMoreScripts()) {
        return onload();
      }
      request = Promise.resolve();
    }

    const item = new QueueItem(this, {
      prev: this.tail,
      isScript,
      keepLast,
      element,
      onload,
      onerror,
    });

    if (this.tail && this.tail != null) {
      if (this.tail.keepLast) {
        // if the tail is the load event in document and we receive a new element to load
        // we should add this new request before the load event.
        if (this.tail.prev) {
          this.tail.prev.next = item;
        }
        item.prev = this.tail.prev;
        this.tail.prev = item;
        item.next = this.tail;
      } else {
        this.tail.next = item;
        this.tail = item;
      }
    } else {
      this.tail = item; 
    }

    return request
      .then(data => {
        item.fired = true;
        item.data = data;
      })
      .catch(error => {
        item.fired = true;
        item.error = error;
      })
      .finally(() => {
        item.check();
      });
  }

  resume() {
    if (!this.paused) {
      return;
    }
    this.paused = false;

    let head = this.tail;
    while (head && head.prev) {
      head = head.prev;
    }
    if (head) {
      head.check();
    }
  }
}
