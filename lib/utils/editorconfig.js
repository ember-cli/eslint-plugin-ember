'use strict';

const editorconfig = require('editorconfig');

/**
 * Resolve editorconfig properties for a given file path using the official
 * editorconfig library.
 *
 * Returns an object like `{ indent_size: 4, indent_style: 'space', ... }`
 * with only the properties that matched. Returns an empty object if no
 * .editorconfig is found or no sections match.
 */
function resolveEditorConfig(filePath) {
  return editorconfig.parseSync(filePath);
}

module.exports = { resolveEditorConfig };
