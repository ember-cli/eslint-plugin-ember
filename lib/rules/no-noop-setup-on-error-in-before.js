'use strict';

const { getImportIdentifier } = require('../utils/import');
const types = require('../utils/types');

//------------------------------------------------------------------------------
// General rule - Disallows no-op `setupOnError` in `before` or `beforeEach`.
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallows using no-op setupOnerror in `before` or `beforeEach`',
      category: 'Testing',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-noop-setup-on-error-in-before.md',
    },
    fixable: 'code',
    schema: [],
    messages: {
      main: 'Using no-op setupOnerror in `before` or `beforeEach` is not allowed',
    },
  },

  create(context) {
    let importedSetupOnerrorName, importedModuleName;
    let isInModule = false;
    let isInBeforeEachHook = false;
    let isInBeforeHook = false;
    let hooksName;
    const sourceCode = context.getSourceCode();

    function reportErrorForNodeIfInBefore(node) {
      const isInBeforeOrBeforeEach =
        (isInBeforeEachHook || isInBeforeHook) &&
        types.isIdentifier(node.callee) &&
        node.callee.name === importedSetupOnerrorName;

      const callback = node.arguments[0];
      const isFunction =
        types.isArrowFunctionExpression(callback) ||
        types.isFunctionDeclaration(callback) ||
        types.isFunctionExpression(callback);

      const isNoop =
        callback &&
        isFunction &&
        callback.body &&
        callback.body.type === 'BlockStatement' &&
        callback.body.body.length === 0;

      if (isInBeforeOrBeforeEach && isNoop) {
        context.report({
          node,
          messageId: 'main',
          *fix(fixer) {
            yield fixer.remove(node);
            const semicolon = sourceCode.getTokenAfter(node);
            if (semicolon && semicolon.value === ';') {
              yield fixer.remove(semicolon);
            }
          },
        });
      }
    }

    return {
      ImportDeclaration(node) {
        if (node.source.value === '@ember/test-helpers') {
          importedSetupOnerrorName =
            importedSetupOnerrorName ||
            getImportIdentifier(node, '@ember/test-helpers', 'setupOnerror');
        }
        if (node.source.value === 'qunit') {
          importedModuleName = importedModuleName || getImportIdentifier(node, 'qunit', 'module');
        }
      },

      CallExpression(node) {
        if (types.isIdentifier(node.callee) && node.callee.name === importedModuleName) {
          isInModule = true;
          if (node.arguments.length > 1 && node.arguments[1]) {
            const moduleCallback = node.arguments[1];
            hooksName =
              moduleCallback.params &&
              moduleCallback.params.length > 0 &&
              types.isIdentifier(moduleCallback.params[0]) &&
              moduleCallback.params[0].name;
          }
        }
        if (types.isIdentifier(node.callee) && node.callee.name === importedSetupOnerrorName) {
          reportErrorForNodeIfInBefore(node);
        }
      },

      'CallExpression:exit'(node) {
        if (types.isIdentifier(node.callee) && node.callee.name === importedModuleName) {
          isInModule = false;
          hooksName = undefined;
        }
      },

      // potentially entering a `beforeEach` hook
      'CallExpression[callee.property.name="beforeEach"]'(node) {
        if (
          isInModule &&
          hooksName &&
          types.isIdentifier(node.callee.object) &&
          node.callee.object.name === hooksName
        ) {
          isInBeforeEachHook = true;
        }
      },

      // potentially exiting a `beforeEach` hook
      'CallExpression[callee.property.name="beforeEach"]:exit'() {
        if (isInBeforeEachHook) {
          isInBeforeEachHook = false;
          hooksName = undefined;
        }
      },

      // potentially entering a `before` hook
      'CallExpression[callee.property.name="before"]'(node) {
        if (
          isInModule &&
          hooksName &&
          types.isIdentifier(node.callee.object) &&
          node.callee.object.name === hooksName
        ) {
          isInBeforeHook = true;
        }
      },

      // potentially exiting a `before` hook
      'CallExpression[callee.property.name="before"]:exit'() {
        if (isInBeforeHook) {
          isInBeforeHook = false;
          hooksName = undefined;
        }
      },
    };
  },
};
