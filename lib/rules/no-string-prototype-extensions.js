'use strict';

const ERROR_MESSAGE = 'Do not using `String` prototype extension methods.';

const EXTENSION_METHODS = new Set([
  'camelize',
  'capitalize',
  'classify',
  'dasherize',
  'decamelize',
  'htmlSafe',
  'loc',
  'underscore',
  'w',
]);

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of `String` prototype extensions',
      category: 'Deprecations',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-string-prototype-extensions.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    return {
      CallExpression(node) {
        const { callee } = node;
        if (callee.type !== 'MemberExpression') {
          return;
        }

        const { object, property } = callee;
        if (object.type === 'ThisExpression') {
          return;
        }
        if (property.type !== 'Identifier') {
          return;
        }

        if (EXTENSION_METHODS.has(property.name)) {
          context.report({ node: property, message: ERROR_MESSAGE });
        }
      },
    };
  },
};
