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
<xsml version="1.1">
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

    const xsmlElement = dom.document.querySelector('xsml');
    expect(xsmlElement).not.toBeNull();
    expect(xsmlElement?.getAttribute('version')).toBe('1.1');
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

  it('should create a document manifest from an empty XSML', async () => {
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
    const manifest = await dom.createDocumentManifest();
    expect(manifest.specVersion).toBe('1.0');
    expect(manifest.url).toBe('https://example.com/');
    expect(manifest.title).toBe('Example');
    dom.unload();
  });

  it('should create a document manifest with specified version', async () => {
    const dom = new JSARDOM(`
  <xsml version="1.1">
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
    const manifest = await dom.createDocumentManifest();
    expect(manifest.specVersion).toBe('1.1');
    dom.unload();
  });

  it('should create a document manifest with specified names and properties', async () => {
    const dom = new JSARDOM(`
  <xsml version="1.1">
    <head>
      <title>Example</title>
      <meta charset="utf-8">
      <meta name="description" content="This is an example.">
      <meta name="author" content="M-CreativeLab">
      <meta name="keywords" content="example, xsml">
      <meta name="rating" content="general">
      <meta name="license" content="MIT">
      <meta name="license-url" content="https://opensource.org/licenses/MIT">
    </head>
    <space>
    </space>
  </xsml>
        `, {
      url: 'https://example.com',
      nativeDocument: sharedNativeDocument,
    });
    await dom.load();
    const manifest = await dom.createDocumentManifest();
    expect(manifest.specVersion).toBe('1.1');
    expect(manifest.charset).toBe('utf-8');
    expect(manifest.description).toBe('This is an example.');
    expect(manifest.author).toBe('M-CreativeLab');
    expect(manifest.keywords).toBe('example, xsml');
    expect(manifest.rating).toBe('general');
    expect(manifest.license).toBe('MIT');
    expect(manifest.licenseUrl).toBe('https://opensource.org/licenses/MIT');
    dom.unload();
  });

  it('should create a document manifest with viewport', async () => {
    const dom = new JSARDOM(`
  <xsml version="1.1">
    <head>
      <title>Example</title>
      <meta charset="utf-8">
      <meta name="viewport" content="initial-scale=1.0, maximum-scale=2.0, minimum-scale=0.5">
    </head>
    <space>
    </space>
  </xsml>
        `, {
      url: 'https://example.com',
      nativeDocument: sharedNativeDocument,
    });
    await dom.load();
    const manifest = await dom.createDocumentManifest();
    expect(manifest.viewport.initialScale).toBe(1);
    expect(manifest.viewport.maximumScale).toBe(2);
    expect(manifest.viewport.minimumScale).toBe(0.5);
    dom.unload();
  });

  it('should create a document manifest with a invalid viewport', async () => {
    const dom = new JSARDOM(`
  <xsml version="1.1">
    <head>
      <title>Example</title>
      <meta charset="utf-8">
      <meta name="viewport" content="&#foobar">
    </head>
    <space>
    </space>
  </xsml>
        `, {
      url: 'https://example.com',
      nativeDocument: sharedNativeDocument,
    });
    await dom.load();
    const manifest = await dom.createDocumentManifest();
    expect(manifest.viewport).toBeUndefined();
    dom.unload();
  });
});
