'use strict';

const emberUtils = require('../utils/ember');

const { isComponentLifecycleHookName } = emberUtils;

const ERROR_MESSAGE_NO_COMPONENT_LIFECYCLE_HOOKS =
  'Do not use classic ember components lifecycle hooks. Prefer using "@ember/render-modifiers" or custom functional modifiers.';

module.exports = {
  ERROR_MESSAGE_NO_COMPONENT_LIFECYCLE_HOOKS,
  meta: {
    docs: {
      description:
        'Prevents usage of "classic" ember component lifecycle hooks. Render modifiers or custom functional modifiers should be used instead.',
      category: 'Ember Octane',
      recommended: false,
    },
    fixable: null, // or "code" or "whitespace"
  },

  create(context) {
    let isAnEmberComponent = false;

    const isAClassicLifecycleHook = keyName => {
      return isComponentLifecycleHookName(keyName) && isAnEmberComponent;
    };

    const report = (context, node) => {
      context.report(node, ERROR_MESSAGE_NO_COMPONENT_LIFECYCLE_HOOKS);
    };

    return {
      ClassDeclaration(node) {
        isAnEmberComponent = node.superClass && node.superClass.name === 'Component';
      },

      MemberExpression(node) {
        isAnEmberComponent = node.object.name === 'Component';
      },

      MethodDefinition(node) {
        if (isAClassicLifecycleHook(node.key.name)) {
          report(context, node);
        }
      },

      'Property > FunctionExpression'(node) {
        if (isAClassicLifecycleHook(node.parent.key.name)) {
          report(context, node.parent.key);
        }
      },
    };
  },
};
