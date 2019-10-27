'use strict';

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
    let importedComponentType;

    function isGlimmerComponent(importName) {
      return importName === '@glimmer/component';
    }

    return {
      ImportDeclaration(node) {
        importedComponentType = node.source.value;
      },

      MethodDefinition(node) {
        if (node.key.name === 'didDestroyElement' && isGlimmerComponent(importedComponentType)) {
          context.report(node, ERROR_MESSAGE_NO_COMPONENT_LIFECYCLE_HOOKS);
        }
      },
    };
  },
};
