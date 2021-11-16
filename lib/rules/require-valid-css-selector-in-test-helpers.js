'use strict';

const { getPropertyValue, parseCallee } = require('../utils/utils');
const cssTree = require('css-tree');
const emberUtils = require('../utils/ember');

/**
 * Positive lookahead regexp.
 * Used for splitting a string only by commas that are not inside quotes.
 * Example input string:
 *  - [data-test-row="London, England, GB"], .foo
 * Would match these strings:
 *  - [data-test-row="London, England, GB"]
 *  - .foo
 * https://stackoverflow.com/questions/23582276/split-string-by-comma-but-ignore-commas-inside-quotes/23582323
 */
const REGEX_SPLIT_BY_COMMA_NOT_IN_QUOTES = /,(?=(?:(?:[^"']*["']){2})*[^"']*$)/g;

const TEST_MODULE_NAMES = new Set(['module', 'describe']);
const TEST_HELPER_IMPORTS = new Set([
  'blur',
  'click',
  'doubleClick',
  'fillIn',
  'find',
  'findAll',
  'focus',
  'scrollTo',
  'select',
  'tap',
  'triggerEvent',
  'triggerKeyEvent',
  'typeIn',
  'waitFor',
]);
const QUERY_SELECTOR_METHODS = new Set(['querySelectorAll', 'querySelector']);
const PARENT_NODE_NAMES = new Set(['element', 'document']);
const SELECTOR_RULES = Object.freeze({
  unclosedAttr: {
    hasError: (str) =>
      str
        .split(REGEX_SPLIT_BY_COMMA_NOT_IN_QUOTES)
        .map((str) => str.trim())
        .some((selector) => hasMissingClosingBracket(selector)),
    fix(node, str, fixer) {
      const replacement = str
        .split(REGEX_SPLIT_BY_COMMA_NOT_IN_QUOTES)
        .map((selector) => (hasMissingClosingBracket(selector) ? `${selector}]` : selector))
        .join(',');
      return fixer.replaceText(node.arguments[0], `'${replacement}'`);
    },
    errorMessage:
      'Syntax error, you used an unclosed attribute selector: "{{selector}}", should be: "{{selector}}]"',
  },
  idStartsWithNumber: {
    hasError: (str) =>
      str
        .split(REGEX_SPLIT_BY_COMMA_NOT_IN_QUOTES)
        .map((str) => str.trim())
        .some((selector) => selector.match(/^#\d/)),
    fix() {},
    errorMessage: 'Syntax error, ids cannot start with a number: "{{selector}}"',
  },
  other: {
    hasError: (str) =>
      str
        .split(REGEX_SPLIT_BY_COMMA_NOT_IN_QUOTES)
        .map((str) => str.trim())
        .some((selector) => !_isValidSelector(selector)),
    fix() {},
    errorMessage: 'Syntax error, "{{selector}}" is not a valid selector',
  },
});

function hasMissingClosingBracket(selector) {
  return selector.includes('[') && !selector.includes(']');
}

function _isValidSelector(selector) {
  try {
    cssTree.parse(selector, {
      context: 'selector',
    });
  } catch {
    return false;
  }

  return true;
}

function _isAssertDomCall(node, assertIdentifierName) {
  const calleeName = parseCallee(node) || [];

  if (calleeName[1] !== 'dom' || !assertIdentifierName) {
    return false;
  }

  return calleeName[0] === assertIdentifierName;
}

function _isQuerySelectorCall(node, testModuleSpecifier) {
  const calleeName = parseCallee(node);

  // only validate querySelector calls in the test module context
  if (!testModuleSpecifier) {
    return false;
  }

  return QUERY_SELECTOR_METHODS.has(calleeName[1]) && PARENT_NODE_NAMES.has(calleeName[0]);
}

function _isTestHelperCall(node, hasTestHelperImport, localImportNames) {
  const calleeName = parseCallee(node) || [];

  return hasTestHelperImport && localImportNames.includes(calleeName[0]);
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow using invalid CSS selectors in test helpers',
      category: 'Testing',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/require-valid-css-selector-in-test-helpers.md',
    },
    fixable: 'code',
    schema: [],
    messages: Object.keys(SELECTOR_RULES).reduce((accumulator, currentVal) => {
      const _accumulator = accumulator || {};
      _accumulator[currentVal] = SELECTOR_RULES[currentVal].errorMessage;

      return _accumulator;
    }, null),
  },
  create(context) {
    if (!emberUtils.isTestFile(context.getFilename())) {
      // This rule does not apply to test files.
      return {};
    }
    let hasTestHelperImport = false;
    let localImportNames = [];
    let testImportLocalName = '';
    let testModuleSpecifier = '';
    let assertIdentifierName = '';

    return {
      'ImportDeclaration[source.value="@ember/test-helpers"]'(node) {
        hasTestHelperImport = getPropertyValue(node, 'specifiers').find((specifier) =>
          TEST_HELPER_IMPORTS.has(getPropertyValue(specifier, 'imported.name'))
        );

        localImportNames = getPropertyValue(node, 'specifiers')
          .filter((specifier) =>
            TEST_HELPER_IMPORTS.has(getPropertyValue(specifier, 'imported.name'))
          )
          .map((specifier) => getPropertyValue(specifier, 'local.name'));
      },
      ImportDeclaration(node) {
        if (!node.source.value === 'qunit' && !node.source.value === 'mocha') {
          return;
        }

        const testImportSpecifier = getPropertyValue(node, 'specifiers').find(
          (specifier) => getPropertyValue(specifier, 'imported.name') === 'test'
        );

        if (!testModuleSpecifier) {
          testModuleSpecifier = getPropertyValue(node, 'specifiers').find((specifier) =>
            TEST_MODULE_NAMES.has(getPropertyValue(specifier, 'imported.name'))
          );
        }

        if (testImportSpecifier) {
          testImportLocalName = getPropertyValue(testImportSpecifier, 'local.name');
        }
      },
      CallExpression(node) {
        if (node.callee.name === testImportLocalName) {
          const [, testFn] = node.arguments || [];

          if (testFn) {
            assertIdentifierName = getPropertyValue(testFn, 'params.0.name');
          }
        }
        const value = getPropertyValue(node, 'arguments.0.value');

        if (
          typeof value !== 'string' ||
          (!_isAssertDomCall(node, assertIdentifierName) &&
            !_isTestHelperCall(node, hasTestHelperImport, localImportNames) &&
            !_isQuerySelectorCall(node, testModuleSpecifier))
        ) {
          return;
        }

        const failureRule = Object.keys(SELECTOR_RULES).find((invalidSelectorKey) =>
          SELECTOR_RULES[invalidSelectorKey].hasError(value)
        );

        if (failureRule) {
          context.report({
            node,
            messageId: failureRule,
            data: { selector: value },
            fix: SELECTOR_RULES[failureRule].fix.bind(null, node, value),
          });
        }
      },
      'CallExpression:exit'(node) {
        if (node.callee.name === testImportLocalName) {
          assertIdentifierName = '';
        }
      },
    };
  },
};
