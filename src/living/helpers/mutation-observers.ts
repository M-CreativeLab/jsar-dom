import { domSymbolTree } from './internal-constants';
import { reportException } from './runtime-script-errors';
import { MutationRecordImpl } from '../mutation-observer/mutation-record';
import { MutationObserverImpl } from '../mutation-observer/mutation-observer';
import { NodeImpl } from '../nodes/node';

export const MUTATION_TYPE = {
  ATTRIBUTES: 'attributes',
  CHARACTER_DATA: 'characterData',
  CHILD_LIST: 'childList'
};

// Note:
// Since jsdom doesn't currently implement the concept of "unit of related similar-origin browsing contexts"
// (https://html.spec.whatwg.org/multipage/browsers.html#unit-of-related-similar-origin-browsing-contexts)
// we will approximate that the following properties are global for now.

// https://dom.spec.whatwg.org/#mutation-observer-compound-microtask-queued-flag
let mutationObserverMicrotaskQueueFlag = false;

// Non-spec compliant: List of all the mutation observers with mutation records enqueued. It's a replacement for
// mutation observer list (https://dom.spec.whatwg.org/#mutation-observer-list) but without leaking since it's empty
// before notifying the mutation observers.
const activeMutationObservers = new Set<MutationObserver>();

// https://dom.spec.whatwg.org/#signal-slot-list
export const signalSlotList: Array<EventTarget> = [];

// https://dom.spec.whatwg.org/#queue-a-mutation-record
export function queueMutationRecord(
  type,
  target,
  name,
  namespace,
  oldValue,
  addedNodes,
  removedNodes,
  previousSibling,
  nextSibling
) {
  const interestedObservers = new Map();
  const nodes = domSymbolTree.ancestorsToArray(target);

  for (const node of nodes) {
    for (const registered of node._registeredObserverList) {
      const { options, observer: mo } = registered;

      if (
        !(node !== target && options.subtree === false) &&
        !(type === MUTATION_TYPE.ATTRIBUTES && options.attributes !== true) &&
        !(type === MUTATION_TYPE.ATTRIBUTES && options.attributeFilter &&
          !options.attributeFilter.some(value => value === name || value === namespace)) &&
        !(type === MUTATION_TYPE.CHARACTER_DATA && options.characterData !== true) &&
        !(type === MUTATION_TYPE.CHILD_LIST && options.childList === false)
      ) {
        if (!interestedObservers.has(mo)) {
          interestedObservers.set(mo, null);
        }

        if (
          (type === MUTATION_TYPE.ATTRIBUTES && options.attributeOldValue === true) ||
          (type === MUTATION_TYPE.CHARACTER_DATA && options.characterDataOldValue === true)
        ) {
          interestedObservers.set(mo, oldValue);
        }
      }
    }
  }

  for (const [observer, mappedOldValue] of interestedObservers.entries()) {
    const record = new MutationRecordImpl(target._globalObject, [], {
      type,
      target,
      attributeName: name,
      attributeNamespace: namespace,
      oldValue: mappedOldValue,
      addedNodes,
      removedNodes,
      previousSibling,
      nextSibling
    });
    observer._recordQueue.push(record);
    activeMutationObservers.add(observer);
  }

  queueMutationObserverMicrotask();
}

// https://dom.spec.whatwg.org/#queue-a-tree-mutation-record
export function queueTreeMutationRecord(target, addedNodes, removedNodes, previousSibling, nextSibling) {
  queueMutationRecord(
    MUTATION_TYPE.CHILD_LIST,
    target,
    null,
    null,
    null,
    addedNodes,
    removedNodes,
    previousSibling,
    nextSibling
  );
}

// https://dom.spec.whatwg.org/#queue-an-attribute-mutation-record
export function queueAttributeMutationRecord(target, name, namespace, oldValue) {
  queueMutationRecord(
    MUTATION_TYPE.ATTRIBUTES,
    target,
    name,
    namespace,
    oldValue,
    [],
    [],
    null,
    null
  );
}

// https://dom.spec.whatwg.org/#queue-a-mutation-observer-compound-microtask
export function queueMutationObserverMicrotask() {
  if (mutationObserverMicrotaskQueueFlag) {
    return;
  }

  mutationObserverMicrotaskQueueFlag = true;

  Promise.resolve().then(() => {
    notifyMutationObservers();
  });
}

// https://dom.spec.whatwg.org/#notify-mutation-observers
function notifyMutationObservers() {
  mutationObserverMicrotaskQueueFlag = false;

  const notifyList = ([...activeMutationObservers] as MutationObserverImpl[]).sort((a, b) => a._id - b._id);
  activeMutationObservers.clear();

  const signalList = [...signalSlotList];
  signalSlotList.splice(0, signalSlotList.length);

  for (const mutationObserver of notifyList) {
    const records = [...mutationObserver._recordQueue];
    mutationObserver._recordQueue = [];

    for (const node of mutationObserver._nodeList) {
      const nodeAsImpl = node as unknown as NodeImpl;
      nodeAsImpl._registeredObserverList = nodeAsImpl._registeredObserverList.filter(registeredObserver => {
        return registeredObserver.source.observer !== mutationObserver;
      });
    }

    if (records.length > 0) {
      try {
        mutationObserver._callback(records, mutationObserver);
      } catch (e) {
        const { target } = records[0];
        reportException(null, e);
      }
    }
  }

  for (const slot of signalList) {
    const slotChangeEvent = new Event(
      'slotchange',
      { bubbles: true }
    );
    slot.dispatchEvent(slotChangeEvent);
  }
}
