'use strict';

const ember = require('../utils/ember');
const types = require('../utils/types');

//------------------------------------------------------------------------------
// General rule - Don't use observers
//------------------------------------------------------------------------------

const ERROR_MESSAGE = "Don't use observers";

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of observers',
      category: 'Deprecations',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-observers.md',
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
      CallExpression(node) {
        if (ember.isModule(node, 'observer')) {
          report(node);
        }

        const { callee } = node;

        if (
          (types.isThisExpression(callee.object) || types.isMemberExpression(callee)) &&
          types.isIdentifier(callee.property) &&
          callee.property.name === 'addObserver'
        ) {
          report(node);
        }
      },

      Decorator(node) {
        if (ember.isObserverDecorator(node)) {
          report(node);
        }
      },

      ImportDeclaration(node) {
        const importSource = node.source.value;

        if (
          (importSource === '@ember/object' &&
            node.specifiers.some(
              s => (s.imported ? s.imported.name : s.local.name) === 'observer'
            )) ||
          importSource === '@ember/object/observers'
        ) {
          report(node);
        }
      },
    };
  },
};
