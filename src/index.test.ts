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

describe.skip('JSARDOM', () => {
  it('should be able to create a new JSARDOM instance from simple document', async () => {
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
    await dom.load();
    expect(dom.document.title).toBe('Example');
    expect(dom.window.document.title).toBe('Example');
    dom.unload();
  });

  it('should be able to execute script', async () => {
    const dom = new JSARDOM(`
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
    await dom.load();
    dom.unload();
  });
});
