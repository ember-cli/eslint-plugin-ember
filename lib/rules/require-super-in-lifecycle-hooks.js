'use strict';

const ember = require('../utils/ember');
const types = require('../utils/types');
const estraverse = require('estraverse');

function hasMatchingNode(node, matcher) {
  let foundMatch = false;
  estraverse.traverse(node, {
    enter(child) {
      if (!foundMatch && matcher(child)) {
        foundMatch = true;
      }
    },
    fallback: 'iteration',
  });
  return foundMatch;
}

/**
 * Checks for this._super() call.
 * @param {node} node
 * @returns {Boolean}
 */
function isClassicSuper(node) {
  return (
    types.isCallExpression(node) &&
    types.isMemberExpression(node.callee) &&
    types.isThisExpression(node.callee.object) &&
    types.isIdentifier(node.callee.property) &&
    node.callee.property.name === '_super'
  );
}

/**
 * Checks for a call like super.init() or super.didInsertElement().
 * @param {node} node
 * @param {string} hook - name of hook
 * @returns {Boolean}
 */
function isNativeSuper(node, hook) {
  return (
    types.isCallExpression(node) &&
    types.isMemberExpression(node.callee) &&
    node.callee.object.type === 'Super' &&
    types.isIdentifier(node.callee.property) &&
    node.callee.property.name === hook
  );
}

//----------------------------------------------
// General rule - Call super in lifecycle hooks
//----------------------------------------------

const ERROR_MESSAGE = 'Call super in lifecycle hooks';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  ERROR_MESSAGE,

  meta: {
    type: 'problem',
    docs: {
      description: 'require super to be called in lifecycle hooks',
      category: 'Ember Object',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/require-super-in-lifecycle-hooks.md',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          checkInitOnly: {
            type: 'boolean',
            default: false,
          },
          checkNativeClasses: {
            type: 'boolean',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const checkInitOnly = context.options[0] && context.options[0].checkInitOnly;
    const checkNativeClasses = !context.options[0] || context.options[0].checkNativeClasses;

    function report(node, isNativeClass, lifecycleHookName) {
      context.report({
        node,
        message: ERROR_MESSAGE,
        fix(fixer) {
          // attrs hooks should call super without ...arguments to satisfy ember/no-attrs-snapshot rule.
          const replacementArgs = ['didReceiveAttrs', 'didUpdateAttrs'].includes(lifecycleHookName)
            ? ''
            : '...arguments';

          const replacement = isNativeClass
            ? `super.${lifecycleHookName}(${replacementArgs});`
            : `this._super(${replacementArgs});`;
          // Insert right after function curly brace.
          const sourceCode = context.getSourceCode();
          const startOfBlockStatement = sourceCode.getFirstToken(node.value.body);
          return fixer.insertTextAfter(startOfBlockStatement, `\n${replacement}`);
        },
      });
    }

    function isLifecycleHook(node, isGlimmerComponent) {
      return (
        types.isIdentifier(node.key) &&
        types.isFunctionExpression(node.value) &&
        ((checkInitOnly && node.key.name === 'init') ||
          (!checkInitOnly &&
            (node.key.name === 'init' ||
              (!isGlimmerComponent && ember.isComponentLifecycleHook(node)) ||
              (isGlimmerComponent && ember.isGlimmerComponentLifecycleHook(node)))))
      );
    }

    function checkAndReport(
      node,
      isInEmberComponent,
      isInEmberController,
      isInEmberRoute,
      isInEmberMixin,
      isInEmberService,
      isInGlimmerComponent,
      isNativeClass
    ) {
      const hookName = node.key.name;

      if (
        hookName === 'init' &&
        !isInEmberComponent &&
        !isInEmberController &&
        !isInEmberRoute &&
        !isInEmberMixin &&
        !isInEmberService
      ) {
        // Checking `init` hook but not inside any Ember class.
        return;
      } else if (
        hookName !== 'init' &&
        !isInEmberComponent &&
        !isInEmberMixin &&
        !isInGlimmerComponent
      ) {
        // Checking a component lifecycle hook but not inside a component/mixin which could have them.
        return;
      }

      const body = isNativeSuper ? node.value.body : node.body;
      const hasSuper = hasMatchingNode(body, (bodyChild) =>
        isNativeClass ? isNativeSuper(bodyChild, hookName) : isClassicSuper(bodyChild)
      );
      if (!hasSuper) {
        report(node, isNativeClass, hookName);
      }
    }

    let currentEmberComponent = null;
    let currentEmberController = null;
    let currentEmberRoute = null;
    let currentEmberMixin = null;
    let currentEmberService = null;
    let currentGlimmerComponent = null;

    return {
      ClassDeclaration(node) {
        if (ember.isEmberComponent(context, node)) {
          currentEmberComponent = node;
        } else if (ember.isEmberController(context, node)) {
          currentEmberController = node;
        } else if (ember.isEmberRoute(context, node)) {
          currentEmberRoute = node;
        } else if (ember.isEmberMixin(context, node)) {
          currentEmberMixin = node;
        } else if (ember.isEmberService(context, node)) {
          currentEmberService = node;
        } else if (ember.isGlimmerComponent(context, node)) {
          currentGlimmerComponent = node;
        }
      },

      'ClassDeclaration:exit'(node) {
        switch (node) {
          case currentEmberComponent: {
            currentEmberComponent = null;

            break;
          }
          case currentEmberController: {
            currentEmberController = null;

            break;
          }
          case currentEmberRoute: {
            currentEmberRoute = null;

            break;
          }
          case currentEmberMixin: {
            currentEmberMixin = null;

            break;
          }
          case currentEmberService: {
            currentEmberService = null;

            break;
          }
          case currentGlimmerComponent: {
            currentGlimmerComponent = null;

            break;
          }
          // No default
        }
      },

      MethodDefinition(node) {
        if (!checkNativeClasses) {
          // Option off.
          return;
        }

        if (!isLifecycleHook(node, currentGlimmerComponent)) {
          return;
        }

        checkAndReport(
          node,
          currentEmberComponent,
          currentEmberController,
          currentEmberRoute,
          currentEmberMixin,
          currentEmberService,
          currentGlimmerComponent,
          true
        );
      },

      Property(node) {
        const parentParent = node.parent.parent;
        if (!types.isCallExpression(parentParent)) {
          // Not inside potential Ember class.
          return;
        }

        if (!isLifecycleHook(node)) {
          return;
        }

        checkAndReport(
          node,
          ember.isEmberComponent(context, parentParent),
          ember.isEmberController(context, parentParent),
          ember.isEmberRoute(context, parentParent),
          ember.isEmberMixin(context, parentParent),
          ember.isEmberService(context, parentParent),
          false,
          false
        );
      },
    };
  },
};
