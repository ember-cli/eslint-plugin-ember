'use strict';

const types = require('../utils/types');

const ERROR_MESSAGE = 'Use `||` or the ternary operator instead of `getWithDefault()`';

module.exports = {
  ERROR_MESSAGE,
  meta: {
    type: 'suggestion',
    docs: {
      description: "disallow usage of the Ember's `getWithDefault` function",
      category: 'Ember Object',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-get-with-default.md',
    },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    return {
      CallExpression(node) {
        if (
          types.isMemberExpression(node.callee) &&
          types.isThisExpression(node.callee.object) &&
          types.isIdentifier(node.callee.property) &&
          node.callee.property.name === 'getWithDefault' &&
          node.arguments.length === 2
        ) {
          // Example: this.getWithDefault('foo', 'bar');
          context.report({
            node,
            message: ERROR_MESSAGE,
            fix(fixer) {
              return fix(fixer, context, node, node.arguments[0], node.arguments[1], false);
            },
          });
        }

        if (
          types.isIdentifier(node.callee) &&
          node.callee.name === 'getWithDefault' &&
          node.arguments.length === 3 &&
          types.isThisExpression(node.arguments[0])
        ) {
          // Example: getWithDefault(this, 'foo', 'bar');
          context.report({
            node,
            message: ERROR_MESSAGE,
            fix(fixer) {
              return fix(fixer, context, node, node.arguments[1], node.arguments[2], true);
            },
          });
        }
      },
    };
  },
};

/**
 * @param {fixer} fixer
 * @param {context} context
 * @param {node} node - node with: this.getWithDefault('foo', 'bar');
 * @param {node} nodeProperty - node with: 'foo'
 * @param {node} nodeDefault - node with: 'bar'
 */
function fix(fixer, context, node, nodeProperty, nodeDefault, useImportedGet) {
  const sourceCode = context.getSourceCode();

  const nodePropertySourceText = sourceCode.getText(nodeProperty);
  const nodeDefaultSourceText = sourceCode.getText(nodeDefault);

  // We convert it to use `this.get('property')` here for safety.
  // The `no-get` rule can then convert it to ES5 getters (`this.property`) if safe.
  const fixed = useImportedGet
    ? `(get(this, ${nodePropertySourceText}) === undefined ? ${nodeDefaultSourceText} : get(this, ${nodePropertySourceText}))`
    : `(this.get(${nodePropertySourceText}) === undefined ? ${nodeDefaultSourceText} : this.get(${nodePropertySourceText}))`;

  return fixer.replaceText(node, fixed);
}
