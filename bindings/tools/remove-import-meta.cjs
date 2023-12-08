const { glob } = require('glob');
const fsPromises = require('fs/promises');

glob('./**/pkg/*.js').then((files) => {
  files.forEach(async (file) => {
    const jsSourceCode = await fsPromises.readFile(file, 'utf8');
    const fixedSourceCode = jsSourceCode
      .replace(/import\.meta\.url/g, `''/** import.meta.url */`);
    fsPromises.writeFile(file, fixedSourceCode, 'utf8');
  });
});
