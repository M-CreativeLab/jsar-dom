const fs = require('fs/promises');
const packageJson = require('./package.json');

packageJson.dependencies = {};
fs.writeFile('./package.json', JSON.stringify(packageJson, null, 2));
