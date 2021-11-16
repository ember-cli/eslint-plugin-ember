'use strict';

const ember = require('../utils/ember');
const types = require('../utils/types');
const { getImportIdentifier } = require('../utils/import');

//------------------------------------------------------------------------------
// General rule - Don't use observers
//------------------------------------------------------------------------------

const ERROR_MESSAGE = "Don't use observers";

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of observers',
      category: 'Deprecations',
      recommended: true,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-observers.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    const report = function (node) {
      context.report({ node, message: ERROR_MESSAGE });
    };

    let importedEmberName = undefined;
    let importedObserverName = undefined;
    let importedObservesName = undefined;
    let importedAddObserverName = undefined;

    return {
      CallExpression(node) {
        const { callee } = node;
        if (
          // observer();
          types.isIdentifier(callee) &&
          callee.name === importedObserverName
        ) {
          report(node);
        } else if (
          // Ember.observer();
          types.isMemberExpression(callee) &&
          types.isIdentifier(callee.object) &&
          callee.object.name === importedEmberName &&
          types.isIdentifier(callee.property) &&
          callee.property.name === 'observer'
        ) {
          report(node);
        } else if (
          // this.addObserver();
          // Ember.addObserver();
          // foo.addObserver();
          types.isMemberExpression(callee) &&
          types.isIdentifier(callee.property) &&
          callee.property.name === 'addObserver'
        ) {
          report(node);
        } else if (
          // addObserver();
          types.isIdentifier(callee) &&
          callee.name === importedAddObserverName
        ) {
          report(node);
        }
      },

      Decorator(node) {
        if (ember.isObserverDecorator(node, importedObservesName)) {
          report(node);
        }
      },

      ImportDeclaration(node) {
        switch (node.source.value) {
          case 'ember': {
            importedEmberName = importedEmberName || getImportIdentifier(node, 'ember');

            break;
          }
          case '@ember/object': {
            importedObserverName =
              importedObserverName || getImportIdentifier(node, '@ember/object', 'observer');

            break;
          }
          case '@ember-decorators/object': {
            importedObservesName =
              importedObservesName ||
              getImportIdentifier(node, '@ember-decorators/object', 'observes');

            break;
          }
          case '@ember/object/observers': {
            importedAddObserverName =
              importedAddObserverName ||
              getImportIdentifier(node, '@ember/object/observers', 'addObserver');

            break;
          }
          // No default
        }
      },
    };
  },
};
