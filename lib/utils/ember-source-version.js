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
 * Check if the installed ember-source version meets a minimum major.minor requirement.
 *
 * @param {number} major - Required minimum major version
 * @param {number} minor - Required minimum minor version
 * @param {string} [projectRoot] - Project root directory (defaults to process.cwd())
 * @returns {boolean} True if installed ember-source version >= major.minor
 */
function isEmberSourceVersionAtLeast(major, minor, projectRoot) {
  const version = getEmberSourceVersion(projectRoot);
  return isVersionAtLeast(version, major, minor);
}

module.exports = {
  isEmberSourceVersionAtLeast,
};
