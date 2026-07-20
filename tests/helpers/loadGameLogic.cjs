/* §17.2: loads the real question-generator/adaptivity logic straight out of
 * app.html into a Node vm sandbox, so unit tests run the exact shipped code
 * with zero duplication and zero risk of the test and the app drifting apart.
 *
 * Only the pure-JS prefix (utils through generateQuestions) is extracted —
 * everything after that point is JSX and needs Babel, which these tests
 * don't need since they never touch rendering.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const loadContent = require('../../content.js.export.cjs');

const START_MARKER = 'const shuffle = arr =>';
const END_MARKER = 'const NODE_COUNT = 5;';

function loadGameLogic({ content = loadContent() } = {}) {
  const appHtml = fs.readFileSync(path.join(__dirname, '../../app.html'), 'utf8');
  const start = appHtml.indexOf(START_MARKER);
  const end = appHtml.indexOf(END_MARKER, start);
  if (start === -1 || end === -1) {
    throw new Error('loadGameLogic: markers not found — app.html structure changed, update the markers in tests/helpers/loadGameLogic.cjs');
  }
  const src = appHtml.slice(start, end);

  const sandbox = { window: { BLOOM_CONTENT: content }, console };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: 'app.html (extracted logic)' });
  // vm globals (Math, Array, ...) live in the sandbox's own realm and aren't
  // enumerable own-properties of the context object — grab a real reference
  // from inside the sandbox so tests can seed ITS Math.random, not the host's.
  sandbox.Math = vm.runInContext('Math', sandbox);
  return sandbox;
}

module.exports = { loadGameLogic };
