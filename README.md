# JSAR-DOM

This project JSAR-DOM is a JavaScript implementation of many Web standards, notably the WHATWG [DOM][], [WebXR][] and XSML, for use in Node.js and browser. This project is a part of the [JSAR][] project, which is a Web-compatible runtime for integrating XR applications into native environments like Unity.

> JSAR-DOM is a fork of [jsdom/jsdom][] project with a TypeScript rewrite and added the support for XSML and SCSS.

## Installation

```sh
npm install @yodaos-jsar/dom
```

## Usage

JSAR-DOM is designed to be a drop-in and easy-to-use replacement for the `jsdom` package. After installing it, you just need to change your `require` or `import` call from `jsdom` to `@yodaos-jsar/dom`:

```js
import { JSARDOM } from '@yodaos-jsar/dom';
// or
const { JSARDOM } = require('@yodaos-jsar/dom');
```

Then you can use it exactly as you would use `jsdom`:

```js
const dom = new JSARDOM(`
<xsml>
  <head>
    <title>Hello JSAR</title>
  </head>
  <space>
    <sphere />
  </space>
</xsml>
`, {
  url: 'https://example.com',
  nativeDocument: yourNativeDocument,
});

dom.window.document.querySelector('sphere').spatialStyle.scaling = [1.2, 1.2, 1.2];
```

Because JSAR-DOM is not going to be a emulator of the traditional browser, it's an in-production implementation of the WHATWG [DOM][], [WebXR][] and XSML for XR applications, so an instance of implementing the `NativeDocument` interface must be pass to the constructor, which implemented the underlying stuffs like rendering and event handling.

### Using headless `NativeDocument` implementation

If you want to use JSAR-DOM in a headless environment, you can use the `HeadlessNativeDocument` implementation, which is a headless implementation of the `NativeDocument` interface.

```sh
$ ts-node src/impl-headless.ts ./fixtures/simple.xsml
```

At JSAR-DOM project, we use the this implementation for tests purpose, you could also use it to see how to write a `NativeDocument` implementation, or just run a XSML application in a headless environment.

## What's XSML?

XSML: eXtensible Spatial Markup Language.

It is a XML-based markup language for describing XR applications. It's designed to be a subset of HTML, and it's also a part of the JSAR project.

> **Why not X3D**
>
> [X3D][] is a great standard for describing 3D scenes after [VRML][], but it's not designed for Web developers and not extending the HTML standard, XSML is designed to be a subset of HTML and it's easy to learn for Web developers.

An example of XSML:

```xml
<xsml>
  <head>
    <title>Hello JSAR-DOM</title>
  </head>
  <space>
    <sphere />
  </space>
</xsml>
```

## What's SCSS?

SCSS: Spatial Cascading Style Sheets.

It's a CSS-like language for styling XSML elements, it's designed to be a part of new CSS standard and compatible with the CSS3 standard. SCSS added some new features for styling spatial elements, like `rotation`, `position`, `scaling`, materials and textures.

An example of SCSS:

```css
@material litered {
  diffuse-color: red;
}

sphere {
  scaling: 1.2 1.2 1;
  material: "litered"
}
```

[jsdom/jsdom]: https://github.com/jsdom/jsdom
[DOM]: https://dom.spec.whatwg.org/
[WebXR]: https://www.w3.org/TR/webxr/
[JSAR]: https://jsar.netlify.app/
[X3D]: https://en.wikipedia.org/wiki/X3D
[VRML]: https://en.wikipedia.org/wiki/VRML
