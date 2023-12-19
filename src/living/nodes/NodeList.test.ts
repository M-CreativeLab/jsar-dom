import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { JSARDOM } from '../../index';
import { HeadlessNativeDocument } from '../../impl-headless';

let sharedNativeDocument: HeadlessNativeDocument;
beforeAll(() => {
  sharedNativeDocument = new HeadlessNativeDocument();
});
afterAll(() => {
  sharedNativeDocument.close();
});

describe('JSARDOM.NodeList', () => {
  it('should supports access item via item()', async () => {
    const dom = new JSARDOM(`
<xsml>
  <space>
    <cube></cube>
    <cube></cube>
    <cube></cube>
  </space>
</xsml>
    `, {
      url: '/path/to/your/main.xsml',
      nativeDocument: sharedNativeDocument,
    });
    await dom.load();

    const cubes = dom.document.querySelectorAll('cube');
    expect(cubes.length).toBe(3);
    expect(cubes.item(0).tagName).toBe('CUBE');
    dom.unload();
  });

  it('should supports forEach()', async () => {
    const dom = new JSARDOM(`
<xsml>
  <space>
    <cube id="1"></cube>
    <cube id="2"></cube>
    <cube id="3"></cube>
  </space>
</xsml>
    `, {
      url: '/path/to/your/main.xsml',
      nativeDocument: sharedNativeDocument,
    });
    await dom.load();

    const cubes = dom.document.querySelectorAll('cube');
    cubes.forEach((cube, index) => {
      expect(cube.id).toBe(`${index + 1}`);
    });
    dom.unload();
  });

  it('should supports access item via index', async () => {
    const dom = new JSARDOM(`
<xsml>
  <space>
    <cube></cube>
    <cube></cube>
    <cube>
      <div id="root">
        <span class="sub" />
        <span class="sub" />
      </div>
    </cube>
  </space>
</xsml>
    `, {
      url: '/path/to/your/main.xsml',
      nativeDocument: sharedNativeDocument,
    });
    await dom.load();

    const cubes = dom.document.querySelectorAll('cube');
    expect(cubes.length).toBe(3);
    expect(cubes[0].tagName).toBe('CUBE');

    const spans = cubes[2].shadowRoot.querySelectorAll('span.sub');
    expect(spans.length).toBe(2);
    expect(spans[1].className).toBe('sub');
    dom.unload();
  });
});
