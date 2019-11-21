'use strict';

const { isEmberComponent } = require('../utils/ember');
const { getSourceModuleNameForIdentifier } = require('../utils/import');
const {
  isCallExpression,
  isIdentifier,
  isObjectExpression,
  isStringLiteral,
} = require('../utils/types');

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
 * @param {Property|ClassProperty} node
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
 * @return {ClassProperty=}
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
    node.decorators.find(d => isCallExpression(d.expression) && d.expression.callee.name === name)
  );
}

module.exports = {
  ERROR_MESSAGE_REQUIRE_TAGLESS_COMPONENTS,

  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallows using the wrapper element of a Component',
      category: 'Ember Octane',
      recommended: false,
      octane: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/require-tagless-components.md',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    return {
      // Handle classic components
      'CallExpression > MemberExpression[property.name="extend"]'(node) {
        const callExpression = node.parent;

        if (!isEmberComponent(context, callExpression)) {
          return;
        }

        // Handle `.extend` being called with no arguments
        if (callExpression.arguments.length === 0) {
          context.report(callExpression, ERROR_MESSAGE_REQUIRE_TAGLESS_COMPONENTS);
        }

        for (const arg of callExpression.arguments) {
          // Ignore anything other than an object literal, since Mixins can be in here too
          if (!isObjectExpression(arg)) {
            continue;
          }

          let tagNameNode;

          if ((tagNameNode = getNonEmptyTagNameInObjectExpression(arg))) {
            context.report(tagNameNode, ERROR_MESSAGE_REQUIRE_TAGLESS_COMPONENTS);
          } else if (hasNoTagNameInObjectExpression(arg)) {
            context.report(callExpression, ERROR_MESSAGE_REQUIRE_TAGLESS_COMPONENTS);
          }
        }
      },

      // Handle ES class components
      'ClassDeclaration[superClass]'(node) {
        if (getSourceModuleNameForIdentifier(context, node.superClass) === '@ember/component') {
          let tagNameNode;
          let decorator;

          if ((tagNameNode = getNonEmptyTagNameInClassBody(node.body))) {
            context.report(tagNameNode, ERROR_MESSAGE_REQUIRE_TAGLESS_COMPONENTS);
          } else if ((decorator = getDecoratorCallExpressionWithName(node, 'tagName'))) {
            const tagNameArg = decorator.expression.arguments[0];

            if (isStringLiteral(tagNameArg) && tagNameArg.value !== '') {
              context.report(decorator, ERROR_MESSAGE_REQUIRE_TAGLESS_COMPONENTS);
            }
          } else if (hasNoTagNameInClassBody(node.body)) {
            context.report(node.body, ERROR_MESSAGE_REQUIRE_TAGLESS_COMPONENTS);
          }
        }
      },
    };
  },
};
