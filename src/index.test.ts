import { describe, it } from '@jest/globals';
import { JSARDOM } from './';
import { HeadlessNativeDocument } from './impl-headless';

describe('JSARDOM', () => {
  it('should be able to create a new JSARDOM instance from empty document', () => {
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
      nativeDocument: new HeadlessNativeDocument(),
    });
    console.log(dom.document.title);
  });
});
