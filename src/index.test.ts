import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { JSARDOM } from './';
import { HeadlessNativeDocument } from './impl-headless';

let sharedNativeDocument: HeadlessNativeDocument;
beforeAll(() => {
  sharedNativeDocument = new HeadlessNativeDocument();
});
afterAll(() => {
  sharedNativeDocument.close();
});

describe('JSARDOM', () => {
  it('should be able to create a new JSARDOM instance from simple document', () => {
    const dom = new JSARDOM(`
<xsml>
  <head>
    <title>Example</title>
  </head>
  <space>
  </space>
</xsml>
    `, {
      url: 'https://example.com',
      nativeDocument: sharedNativeDocument,
    });
    expect(dom.document.title).toBe('Example');
    expect(dom.window.document.title).toBe('Example');
  });

  it('should be able to execute script', () => {
    new JSARDOM(`
<xsml>
  <head>
    <title>Example</title>
    <script type="module">
      console.log('hello world', new URL('https://example.com'));
    </script>
  </head>
  <space>
  </space>
</xsml>
    `, {
      url: 'https://example.com',
      nativeDocument: sharedNativeDocument,
    });
  });
});
