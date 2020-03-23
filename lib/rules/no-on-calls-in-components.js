'use strict';

const ember = require('../utils/ember');
const utils = require('../utils/utils');
const types = require('../utils/types');

//----------------------------------------------
// Don’t use .on() for component lifecycle events.
//----------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of `on` to call lifecycle hooks in components',
      category: 'Best Practices',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-on-calls-in-components.md',
    },
    fixable: null,
    schema: [],
  },

  create(context) {
    const message = "Don't use .on() for component lifecycle events.";
    const lifecycleHooks = [
      'init',
      'didUpdateAttrs',
      'didReceiveAttrs',
      'willUpdate',
      'willRender',
      'didInsertElement',
      'didUpdate',
      'didRender',
      'willDestroyElement',
      'willClearRender',
      'didDestroyElement',
    ];

    const isOnCall = function (node) {
      if (!node.value) {
        return false;
      }
      const value = node.value;
      const callee = value.callee;
      const args = utils.parseArgs(value);

      return (
        types.isCallExpression(value) &&
        lifecycleHooks.includes(args[0]) &&
        ((types.isIdentifier(callee) && callee.name === 'on') ||
          (types.isMemberExpression(callee) &&
            types.isIdentifier(callee.object) &&
            callee.object.name === 'Ember' &&
            types.isIdentifier(callee.property) &&
            callee.property.name === 'on'))
      );
    };

    const report = function (node) {
      context.report(node, message);
    };

    return {
      CallExpression(node) {
        if (!ember.isEmberComponent(context, node)) {
          return;
        }

        const propertiesWithOnCalls = ember.getModuleProperties(node).filter(isOnCall);

        if (propertiesWithOnCalls.length > 0) {
          propertiesWithOnCalls.forEach((property) => {
            report(property.value);
          });
        }
      },
    };
  },
};
