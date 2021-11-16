'use strict';

const ERROR_MESSAGE =
  'Do not call `settled()` right after a test helper that already calls it internally.';

const SETTLING_TEST_HELPERS = new Set([
  'blur',
  'clearRender',
  'click',
  'doubleClick',
  'fillIn',
  'focus',
  'render',
  'settled',
  'tap',
  'triggerEvent',
  'triggerKeyEvent',
  'typeIn',
  'visit',
]);

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow usage of `await settled()` right after test helper that calls it internally',
      category: 'Testing',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-settled-after-test-helper.md',
    },
    fixable: 'code',
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    const settlingTestHelpers = new Set();

    return {
      ImportDeclaration(node) {
        const { source, specifiers } = node;
        if (source.type !== 'Literal' || source.value !== '@ember/test-helpers') {
          return;
        }

        for (const specifier of specifiers) {
          if (specifier.type !== 'ImportSpecifier') {
            continue;
          }

          const { imported, local } = specifier;
          if (imported.type !== 'Identifier' || local.type !== 'Identifier') {
            continue;
          }

          if (SETTLING_TEST_HELPERS.has(imported.name)) {
            settlingTestHelpers.add(local.name);
          }
        }
      },

      ExpressionStatement(node) {
        if (!isAwaitSettled(node)) {
          return;
        }

        const { parent } = node;
        /* istanbul ignore next */
        if (!Array.isArray(parent.body)) {
          return;
        }

        const index = parent.body.indexOf(node);
        if (index < 1) {
          return;
        }

        const prevStatement = parent.body[index - 1];
        if (!isAwaitSettlingTestHelper(prevStatement, settlingTestHelpers)) {
          return;
        }

        context.report({
          node,
          message: ERROR_MESSAGE,
          fix(fixer) {
            return fixer.remove(node);
          },
        });
      },
    };
  },
};

function isAwaitSettled(node) {
  const { expression } = node;
  if (expression.type !== 'AwaitExpression') {
    return false;
  }

  const { argument } = expression;
  if (argument.type !== 'CallExpression') {
    return false;
  }

  const { callee } = argument;
  return callee.type === 'Identifier' && callee.name === 'settled';
}

function isAwaitSettlingTestHelper(node, settlingTestHelpers) {
  if (node.type !== 'ExpressionStatement') {
    return false;
  }

  const { expression } = node;
  if (expression.type !== 'AwaitExpression') {
    return false;
  }

  const { argument } = expression;
  if (argument.type !== 'CallExpression') {
    return false;
  }

  const { callee } = argument;
  return callee.type === 'Identifier' && settlingTestHelpers.has(callee.name);
}
