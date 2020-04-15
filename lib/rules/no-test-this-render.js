'use strict';

const emberUtils = require('../utils/ember');
const types = require('../utils/types');

const ERROR_MESSAGE =
  'Do not use `this.render()` or `this.clearRender()`. Prefer `render` or `clearRender` from `@ember/test-helpers` instead.';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        "disallow usage of the `this.render` in tests, recommending to use @ember/test-helpers' `render` instead.",
      category: 'Testing',
      url:
        'https://github.com/ember-cli/eslint-plugin-ember/tree/master/docs/rules/no-test-this-render.md',
    },
    fixable: null,
    schema: [],
  },

  ERROR_MESSAGE,

  create(context) {
    if (!emberUtils.isTestFile(context.getFilename())) {
      return {};
    }

    return {
      CallExpression(node) {
        const { callee } = node;

        if (
          types.isThisExpression(callee.object) &&
          types.isIdentifier(callee.property) &&
          (callee.property.name === 'render' || callee.property.name === 'clearRender')
        ) {
          context.report({
            node,
            message: ERROR_MESSAGE,
          });
        }
      },
    };
  },
};
