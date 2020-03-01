'use strict';

const emberUtils = require('../utils/ember');

const { isComponentLifecycleHook, isEmberComponent, isGlimmerComponent } = emberUtils;

const ERROR_MESSAGE_NO_COMPONENT_LIFECYCLE_HOOKS =
  'Do not use classic ember components lifecycle hooks. Prefer using "@ember/render-modifiers" or custom functional modifiers.';

const report = (context, node) => {
  context.report(node, ERROR_MESSAGE_NO_COMPONENT_LIFECYCLE_HOOKS);
};

module.exports = {
  ERROR_MESSAGE_NO_COMPONENT_LIFECYCLE_HOOKS,
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow usage of "classic" ember component lifecycle hooks. Render modifiers or custom functional modifiers should be used instead.',
      category: 'Ember Octane',
      recommended: false,
      octane: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-component-lifecycle-hooks.md',
    },
    fixable: null, // or "code" or "whitespace"
    schema: [],
  },

  create(context) {
    let isInsideEmberComponent = false;
    let currentComponent = null;

    const isAClassicLifecycleHook = keyName => {
      return isComponentLifecycleHook(keyName) && isInsideEmberComponent;
    };

    return {
      ClassDeclaration(node) {
        isInsideEmberComponent =
          isEmberComponent(context, node) || isGlimmerComponent(context, node);
      },

      CallExpression(node) {
        isInsideEmberComponent = emberUtils.isEmberComponent(context, node);
      },

      'ClassDeclaration:exit'() {
        isInsideEmberComponent = false;
      },

      'CallExpression:exit'() {
        isInsideEmberComponent = false;
      },

      MethodDefinition(node) {
        if (isAClassicLifecycleHook(node)) {
          report(context, node);
        }
      },

      Property(node) {
        // TODO: fix
        if (isAClassicLifecycleHook(node)) {
          report(context, node.key);
        }
      },
    };
  },
};
