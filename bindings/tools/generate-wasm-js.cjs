const { glob } = require('glob');
const fsPromises = require('fs/promises');

glob('./**/pkg/*.wasm').then((files) => {
  files.forEach(async (file) => {
    const data = await fsPromises.readFile(file);
    const arrayStr = data.toJSON().data.toString();

    const targetPath = file.replace(/\.wasm$/, '_wasm.ts');
    await fsPromises.writeFile(targetPath, `
export default new Uint8Array([${arrayStr}]);
    `.replace(/^\n/, ''));
  });
});
