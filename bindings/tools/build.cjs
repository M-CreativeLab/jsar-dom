const { execSync } = require('child_process');

[
  '../craft3d',
  '../taffy',
  '../noise',
].forEach(path => {
  execSync(`npx wasm-pack build ${path} --target web`, {
    stdio: 'inherit',
    cwd: __dirname
  });
});
