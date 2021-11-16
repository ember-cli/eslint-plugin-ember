'use strict';

const emberUtils = require('../utils/ember');

const {
  isComponentLifecycleHook,
  isGlimmerComponentLifecycleHook,
  isEmberComponent,
  isGlimmerComponent,
} = emberUtils;

const ERROR_MESSAGE_NO_COMPONENT_LIFECYCLE_HOOKS =
  'Do not use classic ember components lifecycle hooks. Prefer using "@ember/render-modifiers" or custom functional modifiers.';

const report = (context, node) => {
  context.report(node, ERROR_MESSAGE_NO_COMPONENT_LIFECYCLE_HOOKS);
};

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  ERROR_MESSAGE_NO_COMPONENT_LIFECYCLE_HOOKS,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow usage of "classic" ember component lifecycle hooks. Render modifiers or custom functional modifiers should be used instead.',
      category: 'Components',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-component-lifecycle-hooks.md',
    },
    fixable: null, // or "code" or "whitespace"
    schema: [],
  },

  create(context) {
    let isInsideEmberComponent = false;
    let isInsideGlimmerComponent = false;
    let currentComponentNode = null;

    return {
      // Native class.
      ClassDeclaration(node) {
        if (isEmberComponent(context, node)) {
          currentComponentNode = node;
          isInsideEmberComponent = true;
        } else if (isGlimmerComponent(context, node)) {
          currentComponentNode = node;
          isInsideGlimmerComponent = true;
        }
      },

      // Classic class (not used by Glimmer components).
      CallExpression(node) {
        if (isEmberComponent(context, node)) {
          currentComponentNode = node;
          isInsideEmberComponent = true;
        }
      },

      'ClassDeclaration:exit'(node) {
        if (currentComponentNode === node) {
          currentComponentNode = null;
          isInsideEmberComponent = false;
          isInsideGlimmerComponent = false;
        }
      },

      'CallExpression:exit'(node) {
        if (currentComponentNode === node) {
          currentComponentNode = null;
          isInsideEmberComponent = false;
        }
      },

      MethodDefinition(node) {
        if (
          isInsideEmberComponent &&
          isComponentLifecycleHook(node) &&
          !isGlimmerComponentLifecycleHook(node)
        ) {
          // Classic Ember component using classic component lifecycle hook.
          report(context, node);
        } else if (
          isInsideGlimmerComponent &&
          isComponentLifecycleHook(node) &&
          !isGlimmerComponentLifecycleHook(node)
        ) {
          // Glimmer component using classic component lifecycle hook.
          report(context, node);
        }
      },

      Property(node) {
        if (
          isInsideEmberComponent &&
          isComponentLifecycleHook(node) &&
          !isGlimmerComponentLifecycleHook(node)
        ) {
          report(context, node.key);
        }
      },
    };
  },
};
