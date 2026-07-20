/* Node-side accessor for content.js's data (§15.1 bank/stage data). content.js
 * is a browser script that assigns window.BLOOM_CONTENT; this loads the exact
 * same file in a vm sandbox so Node tooling (unit tests, schema validation)
 * reads the real shipped content with no duplication. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

module.exports = function loadContent() {
  const src = fs.readFileSync(path.join(__dirname, 'content.js'), 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: 'content.js' });
  return sandbox.window.BLOOM_CONTENT;
};
