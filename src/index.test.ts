import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { join } from 'path';
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

  it('should be able to set as local mode', async () => {
    const dom = new JSARDOM(`
<xsml>
  <head>
    <title>Example</title>
  </head>
  <space>
  </space>
</xsml>
    `, {
      url: '/path/to/your/main.xsml',
      nativeDocument: sharedNativeDocument,
    });
    await dom.load();
    expect(dom.document.title).toBe('Example');
    expect(dom.document.URL).toBe('file:///path/to/your/main.xsml');
    expect(dom.document.baseURI).toBe('file:///path/to/your/main.xsml');
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

  it('should load JSARDOM from a local path', async () => {
    const xsmlPath = join(
      import.meta.url.replace(/^file:\/\//, ''), '../../fixtures/simple.xsml');
    const dom = new JSARDOM(xsmlPath, {
      nativeDocument: sharedNativeDocument,
    });
    await dom.load();

    const expectUrl = new URL(xsmlPath, 'file:///');
    expect(dom.document.URL).toBe(expectUrl.href);
    dom.unload();
  });

  it('should load JSARDOM from a local path(file://)', async () => {
    const xsmlPath = join(
      import.meta.url.replace(/^file:\/\//, ''), '../../fixtures/simple.xsml');
    const dom = new JSARDOM(`file://${xsmlPath}`, {
      nativeDocument: sharedNativeDocument,
    });
    await dom.load();

    const expectUrl = new URL(xsmlPath, 'file:///');
    expect(dom.document.URL).toBe(expectUrl.href);
    dom.unload();
  });

  it('should load JSARDOM from a remote url', async () => {
    const xsmlUrl = 'https://raw.githubusercontent.com/M-CreativeLab/jsar-dom/main/fixtures/spatial-element.xsml';
    const dom = new JSARDOM(xsmlUrl, {
      nativeDocument: sharedNativeDocument,
    });
    await dom.load();
    expect(dom.document.URL).toBe(xsmlUrl);
    dom.unload();
  });
});
