const fsPromises = require('fs/promises');
const supports = require('../src/living/esm-supports.json');
const { join } = require('path');

function generateLoaderBlock(ext, type) {
  return [
    `declare module \'*${ext}\' {`,
    `  const value: ${type};`,
    '  export default value;',
    '}',
  ].join('\n') + '\n';
}

function copyApiDts() {
  fsPromises.copyFile(
    join(__dirname, '../dist/jsar-api.d.ts'),
    join(__dirname, './jsar-api.d.ts')
  );
}

function createLoadersDts() {
  let dtsCode = '';
  for (const extension of supports.extensions.json) {
    dtsCode += generateLoaderBlock(extension, 'any');
  }
  for (const extension of supports.extensions.arraybuffer) {
    dtsCode += generateLoaderBlock(extension, 'ArrayBuffer');
  }
  fsPromises.writeFile(join(__dirname, 'loaders.d.ts'), dtsCode);
}

function createPackageJson() {
  const packageJson = require('./.package.json');
  const { version } = require('../package.json');
  packageJson.version = version;
  fsPromises.writeFile(
    join(__dirname, 'package.json'),
    JSON.stringify(packageJson, null, 2));
}

copyApiDts();
createLoadersDts();
createPackageJson();
