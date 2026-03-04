const babelESLint = require('@babel/eslint-parser');

/**
 * Parse code using @babel/eslint-parser
 * @param {string} code - The code to parse
 * @param {Object} options - Parse options
 * @param {string} options.sourceType - 'module' or 'script', defaults to 'module'
 * @returns {Object} The parsed AST
 */
function parse(code, options = {}) {
  const sourceType = options.sourceType || 'module';

  return babelESLint.parse(code, {
    sourceType,
    babelOptions: {
      configFile: require.resolve('../../.babelrc'),
    },
  });
}

/**
 * Parse code using @babel/eslint-parser (for ESLint integration)
 * @param {string} code - The code to parse
 * @param {Object} options - Parse options
 * @param {string} options.sourceType - 'module' or 'script', defaults to 'module'
 * @returns {Object} The parsed result with AST and services
 */
function parseForESLint(code, options = {}) {
  const sourceType = options.sourceType || 'module';

  return babelESLint.parseForESLint(code, {
    sourceType,
    babelOptions: {
      configFile: require.resolve('../../.babelrc'),
    },
  });
}

module.exports = {
  parse,
  parseForESLint,
};
