'use strict';

/**
 * Built-in template keywords shipped from `ember-source` 7.1.0
 * (RFCs 389, 470, 560, 561, 562, 997, 998, 999, 1000). They can be referenced
 * in strict-mode (`.gjs` / `.gts`) templates without an explicit import, so
 * ESLint's `no-undef` needs to know about them.
 *
 * Mirrors Glint's `KeywordsForEmber71` gate in
 * `@glint/ember-tsc/types/-private/dsl/globals.d.ts`.
 */
const KEYWORDS = {
  and: 'readonly',
  array: 'readonly',
  element: 'readonly',
  eq: 'readonly',
  fn: 'readonly',
  gt: 'readonly',
  gte: 'readonly',
  hash: 'readonly',
  lt: 'readonly',
  lte: 'readonly',
  neq: 'readonly',
  not: 'readonly',
  on: 'readonly',
  or: 'readonly',
};

/**
 * Returns the 7.1 built-in keywords as an ESLint globals map when the supplied
 * `ember-source` version is >= 7.1.0. Returns an empty object otherwise.
 *
 * Pure — accepts the version string instead of reading the filesystem so it
 * is trivially testable.
 */
function ember71BuiltInKeywordsForVersion(version) {
  if (typeof version !== 'string') {
    return {};
  }

  const [major, minor] = version.split('.').map(Number);
  const isAtLeast71 = major > 7 || (major === 7 && minor >= 1);

  return isAtLeast71 ? KEYWORDS : {};
}

/**
 * Probe the consumer's installed `ember-source` to decide whether the 7.1
 * built-in keywords should be exposed as globals.
 *
 * Glint performs the equivalent check at the type level by probing the value
 * exports of `@ember/helper`; we can't do that from a Node-evaluated ESLint
 * config, so we read `ember-source/package.json` and compare semver instead.
 *
 * Returns an empty object if `ember-source` is not resolvable, or if its
 * version is older than 7.1.0, so projects without it (or pre-7.1 projects)
 * keep their existing lint behaviour.
 */
function getEmber71BuiltInKeywords() {
  try {
    // ember-source is a peer of consumers, not of this plugin, so neither the
    // `n/no-missing-require` nor `import/extensions` rules can resolve it here.
    // eslint-disable-next-line n/no-missing-require, import/extensions, import/no-unresolved
    const { version } = require('ember-source/package.json');
    return ember71BuiltInKeywordsForVersion(version);
  } catch {
    return {};
  }
}

module.exports = {
  getEmber71BuiltInKeywords,
  ember71BuiltInKeywordsForVersion,
};
