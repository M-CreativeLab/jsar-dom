import DOMException from 'domexception';
import type { NativeDocument } from '../../impl-interfaces';
import { enqueueCEUpgradeReaction, isValidCustomElementName, tryUpgradeElement } from '../helpers/custom-elements';
import { shadowIncludingInclusiveDescendantsIterator } from '../helpers/shadow-dom';
import { NodeImpl } from '../nodes/Node';
import { getHTMLElementInterface } from '../helpers/create-element';
import { HTML_NS } from '../helpers/namespaces';

const LIFECYCLE_CALLBACKS = [
  'connectedCallback',
  'disconnectedCallback',
  'adoptedCallback',
  'attributeChangedCallback'
];

function convertToSequenceDOMString(obj) {
  if (!obj || !obj[Symbol.iterator]) {
    throw new TypeError("Invalid Sequence");
  }
  return Array.from(obj).map(key => String(key));
}

// Returns true is the passed value is a valid constructor.
// Borrowed from: https://stackoverflow.com/a/39336206/3832710
function isConstructor(value): boolean {
  if (typeof value !== 'function') {
    return false;
  }

  try {
    const P = new Proxy(value, {
      construct() {
        return {};
      }
    });

    // eslint-disable-next-line no-new
    new P();
    return true;
  } catch {
    return false;
  }
}

export type CustomElementDefinition = {
  name: string;
  localName: string;
  constructor: CustomElementConstructor;
  objectReference: any;
  observedAttributes: string[];
  lifecycleCallbacks: {
    connectedCallback: any;
    disconnectedCallback: any;
    adoptedCallback: any;
    attributeChangedCallback: any;
  };
  disableShadow: boolean;
  constructionStack: Element[];
};

export class CustomElementRegistryImpl implements CustomElementRegistry {
  _customElementDefinitions: CustomElementDefinition[];
  _elementDefinitionIsRunning: boolean;
  _whenDefinedPromiseMap: any;

  constructor(private nativeDocument: NativeDocument) {
  }

  define(name: string, constructor: CustomElementConstructor, options?: ElementDefinitionOptions): void {
    const ctor = (constructor as any).objectReference;

    if (!isConstructor(ctor)) {
      throw new TypeError('Constructor argument is not a constructor.');
    }
    if (!isValidCustomElementName(name)) {
      throw new DOMException('Name argument is not a valid custom element name.', 'SyntaxError');
    }

    const nameAlreadyRegistered = this._customElementDefinitions.some(entry => entry.name === name);
    if (nameAlreadyRegistered) {
      throw new DOMException(
        'This name has already been registered in the registry.',
        'NotSupportedError'
      );
    }

    const ctorAlreadyRegistered = this._customElementDefinitions.some(entry => entry.objectReference === ctor);
    if (ctorAlreadyRegistered) {
      throw new DOMException(
        'This constructor has already been registered in the registry.',
        'NotSupportedError'
      );
    }

    let localName = name;
    let extendsOption = null;
    if (options !== undefined && options.extends) {
      extendsOption = options.extends;
    }

    if (extendsOption !== null) {
      if (isValidCustomElementName(extendsOption)) {
        throw new DOMException(
          'Option extends value can\'t be a valid custom element name.',
          'NotSupportedError'
        );
      }

      const extendsInterface = getHTMLElementInterface(extendsOption);
      if (extendsInterface === HTMLUnknownElement) {
        throw new DOMException(
          `${extendsOption} is an HTMLUnknownElement.`,
          'NotSupportedError'
        );
      }
      localName = extendsOption;
    }

    if (this._elementDefinitionIsRunning) {
      throw new DOMException(
        'Invalid nested custom element definition.',
        'NotSupportedError'
      );
    }
    this._elementDefinitionIsRunning = true;

    let disableShadow = false;
    let observedAttributes = [];
    const lifecycleCallbacks = {
      connectedCallback: null,
      disconnectedCallback: null,
      adoptedCallback: null,
      attributeChangedCallback: null
    };

    let caughtError;
    try {
      const { prototype } = ctor;

      if (typeof prototype !== 'object') {
        throw new TypeError('Invalid constructor prototype.');
      }

      for (const callbackName of LIFECYCLE_CALLBACKS) {
        const callbackValue = prototype[callbackName];

        if (callbackValue !== undefined) {
          // TODO
          // lifecycleCallbacks[callbackName] = IDLFunction.convert(_globalObject, callbackValue, {
          //   context: `The lifecycle callback "${callbackName}"`
          // });
        }
      }

      if (lifecycleCallbacks.attributeChangedCallback !== null) {
        const observedAttributesIterable = ctor.observedAttributes;

        if (observedAttributesIterable !== undefined) {
          observedAttributes = convertToSequenceDOMString(observedAttributesIterable);
        }
      }

      let disabledFeatures = [];
      const disabledFeaturesIterable = ctor.disabledFeatures;
      if (disabledFeaturesIterable) {
        disabledFeatures = convertToSequenceDOMString(disabledFeaturesIterable);
      }

      disableShadow = disabledFeatures.includes("shadow");
    } catch (err) {
      caughtError = err;
    } finally {
      this._elementDefinitionIsRunning = false;
    }

    if (caughtError !== undefined) {
      throw caughtError;
    }

    const definition = {
      name,
      localName,
      constructor,
      objectReference: ctor,
      observedAttributes,
      lifecycleCallbacks,
      disableShadow,
      constructionStack: []
    };
    this._customElementDefinitions.push(definition);

    const document = this.nativeDocument.attachedDocument;
    const upgradeCandidates = [];

    for (const candidate of shadowIncludingInclusiveDescendantsIterator(document)) {
      if (
        (candidate._namespaceURI === HTML_NS && candidate._localName === localName) &&
        (extendsOption === null || candidate._isValue === name)
      ) {
        upgradeCandidates.push(candidate);
      }
    }
    for (const upgradeCandidate of upgradeCandidates) {
      enqueueCEUpgradeReaction(upgradeCandidate, definition);
    }
    if (this._whenDefinedPromiseMap[name] !== undefined) {
      this._whenDefinedPromiseMap[name].resolve(ctor);
      delete this._whenDefinedPromiseMap[name];
    }
  }

  get(name: string): CustomElementConstructor {
    const definition = this._customElementDefinitions.find(entry => entry.name === name);
    return definition && definition.objectReference;
  }

  upgrade(root: Node): void {
    for (const candidate of shadowIncludingInclusiveDescendantsIterator(root)) {
      if (candidate.nodeType === NodeImpl.ELEMENT_NODE) {
        tryUpgradeElement(candidate);
      }
    }
  }

  whenDefined(name: string): Promise<CustomElementConstructor> {
    if (!isValidCustomElementName(name)) {
      return Promise.reject(new DOMException(
        'Name argument is not a valid custom element name.', 'SyntaxError'
      ));
    }

    const alreadyRegistered = this._customElementDefinitions.find(entry => entry.name === name);
    if (alreadyRegistered) {
      return Promise.resolve(alreadyRegistered.objectReference);
    }

    if (this._whenDefinedPromiseMap[name] === undefined) {
      let resolve;
      const promise = new Promise(r => {
        resolve = r;
      });

      // Store the pending Promise along with the extracted resolve callback to actually resolve the returned Promise,
      // once the custom element is registered.
      this._whenDefinedPromiseMap[name] = {
        promise,
        resolve
      };
    }
    return this._whenDefinedPromiseMap[name].promise;
  }
}
