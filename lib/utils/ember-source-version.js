'use strict';

const fs = require('node:fs');

/**
 * Get the installed ember-source version by resolving its package.json.
 *
 * @param {string} [projectRoot] - Project root directory (defaults to process.cwd())
 * @returns {string|null} The installed ember-source version, or null if not found
 */
function getEmberSourceVersion(projectRoot) {
  try {
    // eslint-disable-next-line n/no-missing-require
    const pkgPath = require.resolve('ember-source/package.json', {
      paths: [projectRoot || process.cwd()],
    });
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return pkg.version || null;
  } catch {
    return null;
  }
}

/**
 * Check if a semver version string meets a minimum major.minor requirement.
 *
 * @param {string} version - Semver version string (e.g. '6.8.0')
 * @param {number} major - Required minimum major version
 * @param {number} minor - Required minimum minor version
 * @returns {boolean} True if version >= major.minor
 */
function isVersionAtLeast(version, major, minor) {
  if (!version || typeof version !== 'string') {
    return false;
  }

  const parts = version.split('.');
  const vMajor = Number.parseInt(parts[0], 10);
  const vMinor = Number.parseInt(parts[1], 10);

  if (Number.isNaN(vMajor) || Number.isNaN(vMinor)) {
    return false;
  }

  return vMajor > major || (vMajor === major && vMinor >= minor);
}

/**
 * Get the ember-source version that rules should assume: `settings.ember.version`
 * when it is set, otherwise the version installed in the project.
 *
 * @param {import('eslint').Rule.RuleContext} context - The rule context
 * @returns {string|null} The version, or null if it isn't set and ember-source isn't installed
 */
function getEmberSourceVersionForContext(context) {
  const version = context.settings?.ember?.version;
  if (typeof version === 'string') {
    return version;
  }

  return getEmberSourceVersion(context.cwd ?? context.getCwd?.());
}

/**
 * Check if the ember-source version that rules should assume meets a minimum major.minor requirement.
 *
 * @param {number} major - Required minimum major version
 * @param {number} minor - Required minimum minor version
 * @param {import('eslint').Rule.RuleContext} context - The rule context
 * @returns {boolean} True if the ember-source version >= major.minor
 */
function isEmberSourceVersionAtLeast(major, minor, context) {
  return isVersionAtLeast(getEmberSourceVersionForContext(context), major, minor);
}

module.exports = {
  getEmberSourceVersionForContext,
  isEmberSourceVersionAtLeast,
};
