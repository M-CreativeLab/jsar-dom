# DOM

This is a DOM implementation for JSAR runtime, it is based on [jsdom](https://github.com/jsdom/jsdom) partially and use TypeScript to implement the living standard.

Notable changes from jsdom:

- Add a base class `XSMLBaseDocument` which extends from `Node`, and it's used for `SpatialDocument` and `XSMLShadowRoot`.
  - `SpatialDocument` is used to represent the spatial document context.
  - `XSMLShadowRoot` is used to represent an interactive DOM tree which could be attached to a spatial object as a dynamic texture.
- Change the `Node`, `Element`'s `ownerDocument` to be `XSMLBaseDocument` instead of `Document`.

> Note: This is not a Web polyfill for JSAR runtime, which will be available for JSAR user-land, for example, the `EventTarget` polyfill doesn't implemented here which is depended by JSAR runtime itself, too.
