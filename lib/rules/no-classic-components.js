'use strict';

const ERROR_MESSAGE =
  'Use Glimmer components(@glimmer/component) instead of classic components(@ember/component)';

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforces Glimmer components',
      category: 'Ember Octane',
      recommended: false,
      octane: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-classic-components.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    const report = function(node) {
      context.report(node, ERROR_MESSAGE);
    };

    return {
      ImportDeclaration(node) {
        const importSource = node.source.value;

        if (importSource === '@ember/component') {
          report(node);
        }
      },
    };
  },
};
