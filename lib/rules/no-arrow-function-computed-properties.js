'use strict';

const types = require('../utils/types');
const emberUtils = require('../utils/ember');

const ERROR_MESSAGE = 'Do not use arrow functions in computed properties';

module.exports = {
  ERROR_MESSAGE,

  meta: {
    type: 'problem',
    docs: {
      description: 'disallow arrow functions in computed properties',
      category: 'Computed Properties',
      recommended: true,
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-arrow-function-computed-properties.md',
    },
    schema: [
      {
        type: 'object',
        properties: {
          onlyThisContexts: {
            type: 'boolean',
            default: false,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {};
    const onlyThisContexts = options.onlyThisContexts || false;

    let isThisPresent = false;

    return {
      ThisExpression() {
        isThisPresent = true;
      },
      CallExpression() {
        isThisPresent = false;
      },
      'CallExpression:exit'(node) {
        const isComputedArrow =
          emberUtils.isComputedProp(node) &&
          node.arguments.length > 0 &&
          types.isArrowFunctionExpression(node.arguments[node.arguments.length - 1]);

        if (!isComputedArrow) {
          return;
        }

        if (onlyThisContexts) {
          if (isThisPresent) {
            context.report(node.arguments[node.arguments.length - 1], ERROR_MESSAGE);
          }
        } else {
          context.report(node.arguments[node.arguments.length - 1], ERROR_MESSAGE);
        }
      },
    };
  },
};
