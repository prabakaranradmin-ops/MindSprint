/* §17.2: a small seeded PRNG (mulberry32) so generator tests can override
 * Math.random deterministically — "seed 1234 must yield answers containing
 * exactly one correct value" reproduces exactly, every run, on every machine. */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Runs fn() with Math.random replaced by a seeded PRNG, then restores it.
 *  Accepts an optional `target` (defaults to the host Math) so callers whose
 *  logic runs inside a vm sandbox — which has its OWN Math object, unaffected
 *  by patching the host's — can seed the sandbox's Math instead. */
function withSeed(seed, fn, target = Math) {
  const orig = target.random;
  target.random = mulberry32(seed);
  try { return fn(); }
  finally { target.random = orig; }
}

module.exports = { mulberry32, withSeed };
