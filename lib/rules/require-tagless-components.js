'use strict';

const {
  isCallExpression,
  isIdentifier,
  isObjectExpression,
  isStringLiteral,
} = require('../utils/types');
const { getNodeOrNodeFromVariable } = require('../utils/utils');
const { getImportIdentifier } = require('../utils/import');
const { isTestFile } = require('../utils/ember');

const ERROR_MESSAGE_REQUIRE_TAGLESS_COMPONENTS =
  "Please switch to a tagless component by setting `tagName: ''` or converting to a Glimmer component";

/**
 * Whether or not the node represents an identifier called `tagName`
 *
 * @param {object} node
 * @param {boolean}
 */
function isTagNameIdentifier(node) {
  return isIdentifier(node) && node.name === 'tagName';
}

/**
 * Whether or not the node represents a property called `tagName`
 *
 * @param {object} node
 * @return {boolean}
 */
function isTagNameProperty(node) {
  return isTagNameIdentifier(node.key);
}

/**
 * @param {Property|ClassProperty|PropertyDefinition} node
 * @return {boolean}
 */
function isNonEmptyTagNameProperty(node) {
  return isTagNameProperty(node) && isStringLiteral(node.value) && node.value.value !== '';
}

/**
 * @param {ObjectExpression} node
 * @return {Property=}
 */
function getNonEmptyTagNameInObjectExpression(node) {
  return node.properties.find(isNonEmptyTagNameProperty);
}

/**
 * @param {ClassBody} node
 * @return {ClassProperty|PropertyDefinition=}
 */
function getNonEmptyTagNameInClassBody(node) {
  return node.body.find(isNonEmptyTagNameProperty);
}

/**
 * @param {ObjectExpression} node
 * @return {boolean}
 */
function hasNoTagNameInObjectExpression(node) {
  return !node.properties.some(isTagNameProperty);
}

/**
 * @param {ClassBody} node
 * @return {boolean}
 */
function hasNoTagNameInClassBody(node) {
  return !node.body.some(isTagNameProperty);
}

/**
 * @param {ClassBody} node
 * @param {string} name
 * @return {Decorator | undefined}
 */
function getDecoratorCallExpressionWithName(node, name) {
  return (
    node.decorators &&
    node.decorators.find((d) => isCallExpression(d.expression) && d.expression.callee.name === name)
  );
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  ERROR_MESSAGE_REQUIRE_TAGLESS_COMPONENTS,

  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow using the wrapper element of a component',
      category: 'Components',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/require-tagless-components.md',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    if (isTestFile(context.getFilename())) {
      // This rule does not apply to test files.
      return {};
    }

    const sourceCode = context.getSourceCode();
    const { scopeManager } = sourceCode;

    let importedComponentName;

    return {
      ImportDeclaration(node) {
        if (node.source.value === '@ember/component') {
          importedComponentName =
            importedComponentName || getImportIdentifier(node, '@ember/component');
        }
      },

      // Handle classic components
      'CallExpression > MemberExpression[property.name="extend"]'(node) {
        const callExpression = node.parent;

        if (!(node.object.type === 'Identifier' && node.object.name === importedComponentName)) {
          // Not an Ember component.
          return;
        }

        // Handle `.extend` being called with no arguments
        if (callExpression.arguments.length === 0) {
          context.report({
            node: callExpression,
            message: ERROR_MESSAGE_REQUIRE_TAGLESS_COMPONENTS,
          });
        }

        for (const arg of callExpression.arguments) {
          const resultingNode = getNodeOrNodeFromVariable(arg, scopeManager);

          // Ignore anything other than an object literal, since Mixins can be in here too
          if (!isObjectExpression(resultingNode)) {
            continue;
          }

          let tagNameNode;

          if ((tagNameNode = getNonEmptyTagNameInObjectExpression(resultingNode))) {
            context.report({
              node: tagNameNode,
              message: ERROR_MESSAGE_REQUIRE_TAGLESS_COMPONENTS,
            });
          } else if (hasNoTagNameInObjectExpression(resultingNode)) {
            context.report({
              node: callExpression,
              message: ERROR_MESSAGE_REQUIRE_TAGLESS_COMPONENTS,
            });
          }
        }
      },

      // Handle ES class components
      'ClassDeclaration[superClass]'(node) {
        if (
          node.superClass.type === 'Identifier' &&
          node.superClass.name === importedComponentName
        ) {
          let tagNameNode;
          let decorator;

          if ((tagNameNode = getNonEmptyTagNameInClassBody(node.body))) {
            context.report({
              node: tagNameNode,
              message: ERROR_MESSAGE_REQUIRE_TAGLESS_COMPONENTS,
            });
          } else if ((decorator = getDecoratorCallExpressionWithName(node, 'tagName'))) {
            const tagNameArg = decorator.expression.arguments[0];

            if (isStringLiteral(tagNameArg) && tagNameArg.value !== '') {
              context.report({
                node: decorator,
                message: ERROR_MESSAGE_REQUIRE_TAGLESS_COMPONENTS,
              });
            }
          } else if (hasNoTagNameInClassBody(node.body)) {
            context.report({ node: node.body, message: ERROR_MESSAGE_REQUIRE_TAGLESS_COMPONENTS });
          }
        }
      },
    };
  },
};
