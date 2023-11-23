import { BaseWindowImpl } from '../../agent/window';
import { CustomElementDefinition } from '../custom-elements/CustomElementRegistry';
import { ElementImpl } from '../nodes/Element';
import { HTMLElementImpl } from '../nodes/HTMLElement';
import { NodeImpl } from '../nodes/Node';
import { SpatialDocumentImpl } from '../nodes/SpatialDocument';
import { HTML_NS } from './namespaces';
import { reportException } from './runtime-script-errors';
import { shadowIncludingRoot } from './shadow-dom';

const customElementMatchRe = /^[a-z](?:[\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*-(?:[\x2D\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/;

function isPotentialCustomElementName(string: string) {
  return customElementMatchRe.test(string);
}

class CEReactionsStack {
  private _stack: Array<any> = [];
  backupElementQueue: Array<any> = [];
  processingBackupElementQueue = false;

  push(elementQueue) {
    this._stack.push(elementQueue);
  }
  pop() {
    return this._stack.pop();
  }
  isEmpty() {
    return this._stack.length === 0;
  }
  get currentElementQueue() {
    const { _stack } = this;
    return _stack[_stack.length - 1];
  }
}

// In theory separate cross-origin Windows created by separate JSDOM instances could have separate stacks. But, we would
// need to implement the whole agent architecture. Which is kind of questionable given that we don't run our Windows in
// their own separate threads, which is what agents are meant to represent.
const customElementReactionsStack = new CEReactionsStack();

// https://html.spec.whatwg.org/multipage/custom-elements.html#cereactions
function ceReactionsPreSteps() {
  customElementReactionsStack.push([]);
}

function ceReactionsPostSteps() {
  const queue = customElementReactionsStack.pop();
  invokeCEReactions(queue);
}

const RESTRICTED_CUSTOM_ELEMENT_NAME = new Set([
  'annotation-xml',
  'color-profile',
  'font-face',
  'font-face-src',
  'font-face-uri',
  'font-face-format',
  'font-face-name',
  'missing-glyph'
]);

// https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name
function isValidCustomElementName(name: string) {
  if (RESTRICTED_CUSTOM_ELEMENT_NAME.has(name)) {
    return false;
  }
  return isPotentialCustomElementName(name);
}

// https://html.spec.whatwg.org/multipage/custom-elements.html#concept-upgrade-an-element
function upgradeElement(definition: CustomElementDefinition, element: ElementImpl) {
  const { _ceState } = element;
  if (_ceState === 'uncustomized' || _ceState !== 'undefined') {
    return;
  }

  element._ceDefinition = definition;
  element._ceState = 'failed';

  for (const attribute of element._attributeList) {
    const { localName, namespaceURI, value } = attribute;
    enqueueCECallbackReaction(element, 'attributeChangedCallback', [localName, null, value, namespaceURI]);
  }
  if (shadowIncludingRoot(element).nodeType === NodeImpl.DOCUMENT_NODE) {
    enqueueCECallbackReaction(element, 'connectedCallback', []);
  }
  definition.constructionStack.push(element);

  const { constructionStack, constructor: C } = definition;
  let constructionError;
  try {
    if (definition.disableShadow === true && element._shadowRoot !== null) {
      throw new DOMException(
        'Can\'t upgrade a custom element with a shadow root if shadow is disabled',
        'NotSupportedError'
      );
    }

    const constructionResultImpl = new C() as HTMLElementImpl;
    if (constructionResultImpl !== element) {
      throw new TypeError('Invalid custom element constructor return value');
    }
  } catch (error) {
    constructionError = error;
  }
  constructionStack.pop();

  if (constructionError !== undefined) {
    element._ceDefinition = null;
    element._ceReactionQueue = [];
    throw constructionError;
  }
  element._ceState = 'custom';
}

// https://html.spec.whatwg.org/#concept-try-upgrade
function tryUpgradeElement(element) {
  const { _ownerDocument, _namespaceURI, _localName, _isValue } = element;
  const definition = lookupCEDefinition(_ownerDocument, _namespaceURI, _localName, _isValue);
  if (definition !== null) {
    enqueueCEUpgradeReaction(element, definition);
  }
}

// https://html.spec.whatwg.org/#look-up-a-custom-element-definition
function lookupCEDefinition(
  document: SpatialDocumentImpl,
  namespace: string,
  localName: string,
  isValue: any
) {
  const definition: CustomElementDefinition = null;
  if (namespace !== HTML_NS) {
    return definition;
  }
  if (!document._defaultView) {
    return definition;
  }

  const window = document._defaultView as unknown as BaseWindowImpl;
  const registry = window._customElementRegistry;

  const definitionByName = registry._customElementDefinitions.find(def => {
    return def.name === def.localName && def.localName === localName;
  });
  if (definitionByName !== undefined) {
    return definitionByName;
  }

  const definitionByIs = registry._customElementDefinitions.find(def => {
    return def.name === isValue && def.localName === localName;
  });
  if (definitionByIs !== undefined) {
    return definitionByIs;
  }
  return definition;
}

// https://html.spec.whatwg.org/multipage/custom-elements.html#invoke-custom-element-reactions
function invokeCEReactions(elementQueue: ElementImpl[]) {
  while (elementQueue.length > 0) {
    const element = elementQueue.shift();
    const reactions = element._ceReactionQueue;

    try {
      while (reactions.length > 0) {
        const reaction = reactions.shift();

        switch (reaction.type) {
          case 'upgrade':
            upgradeElement(reaction.definition, element);
            break;

          case 'callback':
            reaction.callback.apply(element, reaction.args);
            break;
        }
      }
    } catch (error) {
      reportException(element._hostObject, error);
    }
  }
}

// https://html.spec.whatwg.org/multipage/custom-elements.html#enqueue-an-element-on-the-appropriate-element-queue
function enqueueElementOnAppropriateElementQueue(element: Element) {
  if (customElementReactionsStack.isEmpty()) {
    customElementReactionsStack.backupElementQueue.push(element);
    if (customElementReactionsStack.processingBackupElementQueue) {
      return;
    }
    customElementReactionsStack.processingBackupElementQueue = true;

    Promise.resolve().then(() => {
      const elementQueue = customElementReactionsStack.backupElementQueue;
      invokeCEReactions(elementQueue);
      customElementReactionsStack.processingBackupElementQueue = false;
    });
  } else {
    customElementReactionsStack.currentElementQueue.push(element);
  }
}

// https://html.spec.whatwg.org/multipage/custom-elements.html#enqueue-a-custom-element-callback-reaction
function enqueueCECallbackReaction(element: ElementImpl, callbackName: string, args) {
  const { _ceDefinition: { lifecycleCallbacks, observedAttributes } } = element;
  const callback = lifecycleCallbacks[callbackName];
  if (callback === null) {
    return;
  }

  if (callbackName === 'attributeChangedCallback') {
    const attributeName = args[0];
    if (!observedAttributes.includes(attributeName)) {
      return;
    }
  }

  element._ceReactionQueue.push({
    type: 'callback',
    callback,
    args
  });
  enqueueElementOnAppropriateElementQueue(element);
}

// https://html.spec.whatwg.org/#enqueue-a-custom-element-upgrade-reaction
function enqueueCEUpgradeReaction(element, definition) {
  element._ceReactionQueue.push({
    type: 'upgrade',
    definition
  });
  enqueueElementOnAppropriateElementQueue(element);
}

export {
  customElementReactionsStack,
  ceReactionsPreSteps,
  ceReactionsPostSteps,
  isValidCustomElementName,
  upgradeElement,
  tryUpgradeElement,

  lookupCEDefinition,
  enqueueCEUpgradeReaction,
  enqueueCECallbackReaction,
  invokeCEReactions,
}
