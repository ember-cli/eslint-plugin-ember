'use strict';

const { RuleTester } = require('eslint');
const { version: eslintVersion } = require('eslint/package.json');
const path = require('node:path');

/**
 * Detect ESLint major version for compatibility handling
 */
const eslintMajorVersion = parseInt(eslintVersion.split('.')[0], 10);
const isESLint9OrLater = eslintMajorVersion >= 9;
const isESLint10OrLater = eslintMajorVersion >= 10;

// Cache loaded parsers for performance
const parserCache = new Map();

/**
 * Load parser module (with caching)
 */
function loadParser(parserPath) {
  if (!parserCache.has(parserPath)) {
    parserCache.set(parserPath, require(parserPath));
  }
  return parserCache.get(parserPath);
}

/**
 * Get default parserOptions for @babel/eslint-parser
 */
function getBabelParserOptions() {
  return {
    babelOptions: {
      configFile: path.resolve(__dirname, '../../.babelrc'),
    },
  };
}

/**
 * Convert legacy eslintrc config to flat config format for RuleTester
 * This enables tests to work with both ESLint 8 (eslintrc) and ESLint 9+ (flat config)
 */
function convertToFlatConfig(config) {
  if (!config || !isESLint9OrLater) {
    return config;
  }

  const flatConfig = { ...config };

  // Convert parser string paths to parser objects
  if (typeof config.parser === 'string') {
    flatConfig.languageOptions = flatConfig.languageOptions || {};
    flatConfig.languageOptions.parser = loadParser(config.parser);

    // Add default babelOptions for @babel/eslint-parser
    if (config.parser.includes('@babel/eslint-parser')) {
      flatConfig.languageOptions.parserOptions = {
        ...getBabelParserOptions(),
        ...flatConfig.languageOptions.parserOptions,
      };
    }

    delete flatConfig.parser;
  }

  // Move parserOptions into languageOptions
  if (config.parserOptions) {
    flatConfig.languageOptions = flatConfig.languageOptions || {};
    flatConfig.languageOptions.parserOptions = config.parserOptions;
    delete flatConfig.parserOptions;
  }

  // Move env to languageOptions.globals format (if needed)
  if (config.env) {
    flatConfig.languageOptions = flatConfig.languageOptions || {};
    const globals = flatConfig.languageOptions.globals || {};

    if (config.env.browser) {
      Object.assign(globals, require('globals').browser);
    }
    if (config.env.node) {
      Object.assign(globals, require('globals').node);
    }
    if (config.env.es6 || config.env.es2015) {
      Object.assign(globals, require('globals').es2015);
    }
    if (config.env.es2017) {
      Object.assign(globals, require('globals').es2017);
    }
    if (config.env.es2020) {
      Object.assign(globals, require('globals').es2020);
    }
    if (config.env.es2021) {
      Object.assign(globals, require('globals').es2021);
    }

    if (Object.keys(globals).length > 0) {
      flatConfig.languageOptions.globals = globals;
    }
    delete flatConfig.env;
  }

  return flatConfig;
}

/**
 * ESLint 10 only allows specific error properties: message, messageId, data, line, column, endLine, endColumn, suggestions
 * Strip invalid properties like 'type' from error assertions
 */
const ALLOWED_ERROR_PROPERTIES = new Set([
  'message',
  'messageId',
  'data',
  'line',
  'column',
  'endLine',
  'endColumn',
  'suggestions',
]);

function normalizeErrorsForESLint10(errors) {
  if (!isESLint10OrLater || !errors) {
    return errors;
  }

  return errors.map((error) => {
    if (typeof error === 'string') {
      return error;
    }

    const normalized = {};
    for (const [key, value] of Object.entries(error)) {
      if (ALLOWED_ERROR_PROPERTIES.has(key)) {
        normalized[key] = value;
      }
    }
    return normalized;
  });
}

/**
 * Convert test case config to flat config format
 */
function convertTestCase(testCase) {
  if (typeof testCase === 'string') {
    return testCase;
  }

  if (!isESLint9OrLater) {
    return testCase;
  }

  const converted = { ...testCase };

  // Convert parser string paths to parser objects
  if (typeof testCase.parser === 'string') {
    converted.languageOptions = converted.languageOptions || {};
    converted.languageOptions.parser = loadParser(testCase.parser);

    // Add default babelOptions for @babel/eslint-parser
    if (testCase.parser.includes('@babel/eslint-parser')) {
      converted.languageOptions.parserOptions = {
        ...getBabelParserOptions(),
        ...converted.languageOptions.parserOptions,
      };
    }

    delete converted.parser;
  }

  // Move parserOptions into languageOptions
  if (testCase.parserOptions) {
    converted.languageOptions = converted.languageOptions || {};
    converted.languageOptions.parserOptions = {
      ...converted.languageOptions.parserOptions,
      ...testCase.parserOptions,
    };
    delete converted.parserOptions;
  }

  // Move globals into languageOptions
  if (testCase.globals) {
    converted.languageOptions = converted.languageOptions || {};
    converted.languageOptions.globals = {
      ...converted.languageOptions.globals,
      ...testCase.globals,
    };
    delete converted.globals;
  }

  // Normalize errors for ESLint 10 (strip invalid properties like 'type')
  if (testCase.errors) {
    converted.errors = normalizeErrorsForESLint10(testCase.errors);
  }

  return converted;
}

/**
 * Create a RuleTester that works with both ESLint 8 and 9+
 * @param {Object} config - RuleTester configuration (can be eslintrc or flat config format)
 * @returns {RuleTester}
 */
function createCompatibleRuleTester(config) {
  const flatConfig = convertToFlatConfig(config);
  return new RuleTester(flatConfig);
}

/**
 * Wrap RuleTester.run() to convert test cases for ESLint 9+ compatibility
 * @param {RuleTester} tester - The RuleTester instance
 * @param {string} name - Rule name
 * @param {Object} rule - The rule definition
 * @param {Object} tests - Object with valid and invalid test cases
 */
function runRule(tester, name, rule, tests) {
  if (!isESLint9OrLater) {
    return tester.run(name, rule, tests);
  }

  const convertedTests = {
    valid: (tests.valid || []).map(convertTestCase),
    invalid: (tests.invalid || []).map(convertTestCase),
  };

  return tester.run(name, rule, convertedTests);
}

/**
 * Extended RuleTester class with automatic compatibility conversion
 */
class CompatRuleTester extends RuleTester {
  constructor(config) {
    super(convertToFlatConfig(config));
  }

  run(name, rule, tests) {
    if (!isESLint9OrLater) {
      return super.run(name, rule, tests);
    }

    const convertedTests = {
      valid: (tests.valid || []).map(convertTestCase),
      invalid: (tests.invalid || []).map(convertTestCase),
    };

    return super.run(name, rule, convertedTests);
  }
}

module.exports = {
  isESLint9OrLater,
  convertToFlatConfig,
  convertTestCase,
  createCompatibleRuleTester,
  runRule,
  CompatRuleTester,
  RuleTester: CompatRuleTester,
};
