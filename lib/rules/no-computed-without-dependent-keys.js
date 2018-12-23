'use strict';

const utils = require('../utils/utils');
const ember = require('../utils/ember');

module.exports = {
  meta: {
    docs: {
      description: 'Warns about computed properties without dependent keys',
      category: 'Possible Errors',
      recommended: false,
      url: 'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-computed-without-dependent-keys.md'
    },
    fixable: null, // or "code" or "whitespace"
  },

  create(context) {
    const message = 'A computed property needs dependent keys';

    const report = function (node) {
      context.report(node, message);
    };

    return {
      CallExpression(node) {
        if (!ember.isComputedProp(node) || utils.isMemberExpression(node.parent)) return;

        if (
          (
            node.arguments &&
            node.arguments.length &&
            utils.isFunctionExpression(node.arguments[0])
          ) ||
          (
            node.callee.object &&
            node.callee.object.arguments &&
            node.callee.object.arguments.length &&
            utils.isFunctionExpression(node.callee.object.arguments[0]) &&
            node.callee.property && node.callee.property.name !== 'volatile'
          )
        ) {
          report(node);
        }
      },
    };
  }
};
